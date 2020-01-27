require "#{Rails.root.join('app','serializers','payment_serializer')}"
require "#{Rails.root.join('app','serializers','fja_payment_serializer')}"
class Api::V1::PaymentsController < Api::V1::ApiController
  before_action :set_project, only: [:index, :create, :payment_history]
  before_action :set_payment, only: [:update, :payment_approval, :update_paid_amount]

  load_and_authorize_resource

  def index
    render json: @project.payments, status: 200
  end

  def create
    # checks whether booking form exists or not before adding payment
    unless @project&.project_booking_form&.project_booking_form_files.present?
      return render json: {message: "Signed Booking form Upload is Pending"}, status: 401
    end

    ActiveRecord::Base.transaction do
      if params[:payment][:quotation_ids].present?
        @payment = @project.payments.build(payment_params)
        if @payment.save!
          params[:payment][:quotation_ids].each do |boq|
            # purchase_element_ids = params[:payment][:purchase_element_ids] || []
            # @payment.quotation_payments.create(quotation_id: boq, purchase_element_ids: purchase_element_ids)
            @payment.quotation_payments.create(quotation_id: boq)
            quotation = Quotation.find(boq)
            TaskEscalation.mark_done_task("Payment Addition", "10 %", quotation) if (!quotation.parent_quotation.present? || !quotation.parent_quotation.is_approved) && @payment.payment_stage == "pre_10_percent"
            payment_50_task = quotation.task_escalations.find_by(task_set: TaskSet.find_by(task_name: "Payment Addition", stage: "10% - 40%"), status: "no") if quotation.parent_quotation&.is_approved && @project.status == "wip" && @payment.payment_stage == "10_50_percent"
            TaskEscalation.mark_done_task("Payment Addition", "10% - 40%", quotation) if payment_50_task.present?
          end
          UserNotifierMailer.payment_added(@payment).deliver_now!
          render json: @payment, status: 200
        end
      else
        render json: {message: "Please select atleast 1 Quotation"}, status: 422
      end
    end
  end

  # def update
  #   if @payment.update_attributes!(payment_params)
  #     @payment.quotation_payments.destroy_all
  #     params[:payment][:quotation_ids].each do |boq|
  #       purchase_element_ids = params[:payment][:purchase_element_ids] || []
  #       @payment.quotation_payments.create(quotation_id: boq, purchase_element_ids: purchase_element_ids)
  #     end
  #     @payment.update(is_approved: nil)
  #     render json: @payment, status: 200
  #   else
  #     render json: {message: @payment.errors.full_messages}, status: 422
  #   end
  # end

  # Here Payment will be approved after checking trasaction number or cheque. Payment can be rejected with remark.
  # commented code might be needed in future
  def payment_approval
    if !params[:approve].nil?
      # unless params[:approve] && ((params[:transaction_number].present? && @payment.transaction_number == params[:transaction_number]) || params[:is_cheque])
      #   return render json: {message: "Transaction Number is not matching or cheque is not present"}
      # end
      ActiveRecord::Base.transaction do
        @payment.update!(is_approved: params[:approve], remarks: params[:remarks])
        @payment.update(finance_approved_at: DateTime.now) if @payment.is_approved
        @payment.split_payment(@payment.quotations.pluck(:id)) if @payment.is_approved
        UserNotifierMailer.payment_approved(@payment).deliver_now!
        ### app push notification starts here, if applicable
        # when is it applicable - if this is the first approved payment for the lead ie project.
        project = @payment.project
        lead = project.lead
        if @payment.is_approved && project.payments.where(is_approved: true).first == @payment
          notificationHash =  {
                                title: "Congratulations for sales closure",
                                body:"Your customer lead has given us booking amount and as promised, we will be distributing the commission soon. Keep on checking your wallet section."
                              }
          notificationEmail = User.find(project.lead.created_by).email rescue "email"
          MobileAppNotificationsJob.perform_later(notificationEmail,notificationHash,"Wallet")
        end
        # notification code end
        ### Nikhil's code -  We need to display the list of clients to OM / PM when 10% payment has been verified for that project for a particular BOQ.
        #===== Adding newly created projects record in the OfficeProjectUser table =======
        if @payment.is_approved && ( project.payments.where(is_approved: true, payment_stage: "pre_10_percent").first == @payment ) && lead.present? && lead.assigned_cm.present?
          cm_role_id = Role.find_by_name(:community_manager).id
          om_role_id = OfficeRole.find_by_name(:operational_manager).id
          omcm_mappings = OfficeOmcm.where(user_id: lead.assigned_cm.id, is_active: true)          
          if omcm_mappings.present?
            omcm_mappings.each do |omcm|
              opu = OfficeProjectUser.find_by(project_id: project.id, user_id: lead.assigned_cm.id, role_id: cm_role_id, office_user_id: omcm.office_user_id, office_role_id: om_role_id)
              unless opu.present? 
                new_opu = OfficeProjectUser.create(project_id: project.id, user_id: lead.assigned_cm.id, role_id: cm_role_id, office_user_id: omcm.office_user_id, office_role_id: om_role_id, project_type: 'residential')
                UserNotifierMailer.office_project_assign_mail(new_opu.office_user, project).deliver_now! #<=== mailer added
              else
                opu.update(is_active: true)  if opu.is_active == false
              end
            end
          else
            OfficeProjectUser.find_or_create_by(project_id: project.id, user_id: lead.assigned_cm.id, role_id: cm_role_id, project_type: 'residential')
          end
        end 
        # Nikhil code for opu end
        ### notification to arrivae internal users for 40% payments
        if params[:quotation_id].present? && @payment.is_approved
          quotation = Quotation.find(params[:quotation_id])
          if quotation.present? && quotation.final_boq?
            UserNotifierMailer.payment_of_40_approved(@payment, quotation).deliver_now!
            ## nikhil's mailer to PM and OM, When payment for project is done and payment stage is changed ie. 10% to 40%
            ompm_roles = OfficeRole.where('name = ? or name = ?','project_engineer','operational_manager').pluck(:id)
            ou_ids = OfficeProjectUser.where(office_role_id: ompm_roles, project_id: project.id, is_active: true).distinct(:office_user_id).pluck(:office_user_id)
            office_users = OfficeUser.where(id: ou_ids)
            office_users.each do |user|
              UserNotifierMailer.office_payment_40_mail(user,@payment,quotation).deliver_now!
            end
            ## end nikhil's mailer
          end
        end
        render json: {message: "Status Updated"}, status: 200
      end
    else
        render json: @payment.errors.full_messages, status: 422
    end
  end

  def show
    render json: @payment, serializer: PaymentHistoryDetailSerializer
  end

  def payment_history
    payment_stage = params[:stage].present? ? params[:stage] : "all"
    @payment_history = payment_stage== "all" ? @project.payments : @project.payments.where(payment_stage: payment_stage)
    render json: @payment_history, each_serializer: PaymentHistoryDetailSerializer
  end

  def boq_payment_history
    quotation = Quotation.find params[:boq_id]
    render json:  quotation.payments, each_serializer: PaymentHistoryForBOQ, boq_id: params[:boq_id]
  end

  def lead_payment_receipt
    if params[:receipt_pdf].present? && params[:payment_id].present?
      @payment = Payment.find_by_id params[:payment_id]
      data_hash = {}
      data_hash[:customer_name] = params[:receipt_pdf][:customer_name].present? ? params[:receipt_pdf][:customer_name] : @payment.project.lead.name
      data_hash[:amount] = params[:receipt_pdf][:amount].present? ? params[:receipt_pdf][:amount] : @payment.amount
      data_hash[:date] = params[:receipt_pdf][:date].present? ? DateTime.parse(params[:receipt_pdf][:date]) : @payment.updated_at.strftime("%d-%m-%Y")
      data_hash[:transaction_number] = params[:receipt_pdf][:rtgs_trx_no].present? ? params[:receipt_pdf][:rtgs_trx_no] : @payment.transaction_number
      pdf_content = PaymentReceiptPdf.new(@payment, data_hash)
      filepath = Rails.root.join("tmp","payment_receipt.pdf")
      file_name = "Payment Receipt #{@payment.id}.pdf"
      pdf_content.render_file(filepath)
      if params[:type].present?
        lead = @payment.project.lead
        UserNotifierMailer.share_payment_receipt(lead, filepath, file_name).deliver_now
        render json: {message: "Receipt has been shared successfully through the email to #{@payment&.project&.lead&.name}"}, status: 200
      else 
        base_64_file = Base64.encode64(File.open(filepath).to_a.join)
        file_name = "Payment Receipt #{@payment.id}"
        render json: {base_64_file: base_64_file, file_name: file_name}, status: 200
      end
    else
      render json: {message: "invalid params"}, status: 400
    end
  end

  def download_payment_report
    if current_user.has_any_role?(:city_gm, :design_manager, :sales_manager)
      if current_user.has_role?(:sales_manager)
        lead_ids = current_user.referrers.includes(:referrer_leads).distinct.pluck("leads.id")
        lead_ids << Lead.where(created_by: current_user).distinct
        @quotations = Quotation.joins(project: :lead).where(leads: {id: lead_ids})
      elsif current_user.has_role?(:city_gm)
        cm_ids = current_user.cms.ids
        @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
      elsif current_user.has_role?(:design_manager)
        cm_ids = current_user.dm_cms.ids
        @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
      end
      PaymentDownloadJob.perform_later(current_user, @quotations.pluck(:id))
      render json: {message: "You will get payment report through mail"}, status: 200
    elsif current_user.has_any_role? :finance, :lead_head, :business_head
      PaymentDownloadJob.perform_later(current_user)
      render json: {message: "You will get payment report through mail"}, status: 200
    else
      render json: {message: "You are not allowed to perform this action"}, status: 401
    end
  end

  def dp_payout_payment_report
    DpPayoutPaymentDownloadJob.perform_later(current_user)
    render json: {message: "You will get payment report through mail"}, status: 200
  end

  def update_paid_amount
    unless current_user.has_role?(:finance)
      return render json: {message: "You don't have permission to do this."}, status: :unauthorized
    end
    if @payment.is_approved != nil
      return render json: {message: "This payment is already approved. You can not update the payment"}, status: 400
    end
    if @payment.update(amount: params[:amount])
      render json: {message: "Payment is updated Successfully"}, status: 200
    else
      render json: {message: "Something went wrong"}, status: 400
    end
  end

  # Here you can get payment hystory of clients. And count of action pending and competed payments.
  # if params[:finance_status] is pending then you will get pending payment requests else you will get completed payment request
  # filters are included in this method itself
  def lead_payment_history
    page_size = 15
    @competed_payments = QuotationPayment.includes(payment: :project).where(payments: {is_approved: [ true, false]})
    @pending_payments = QuotationPayment.includes(payment: :project).where(payments: {is_approved: nil})
    @payments = params[:finance_status] == "pending" ? @pending_payments.order(created_at: :desc) : @competed_payments.order("payments.updated_at desc")
    leads = Lead.where(id: @payments.pluck(:lead_id)).order(name: :asc).map{|l| {id: l.id, name: l.name, email: l.email}}
    #filter
    @payments =  @payments.filter_by_lead(params[:lead_id]) if params[:lead_id].present?
    @payments =  @payments.filter_by_ageing(params[:ageing].to_i) if params[:ageing].present?
    if params[:from_date].present? || params[:to_date].present?
      from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
      @payments =  @payments.filter_by_date({from_time: from_time,to_time: to_time})
    end
    # 12-02-2019: We are changing this end-point so that a payment will appear only once even if it is added 
    # against multiple BOQs. This means that ideally, @payments must be of class Payment, not QuotationPayment.
    payment_ids = @payments.pluck(:payment_id).uniq
    @payments = Payment.where(id: payment_ids).order(created_at: :desc)
    page = params[:page].to_i
    if @payments.count < ((page - 1) * page_size)
      params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
    end
    render json: {
      completed_request: @competed_payments.pluck(:payment_id).uniq.count,
      pending_request: @pending_payments.pluck(:payment_id).uniq.count,
      payment_serializer: FjaPaymentSerializer.new(paginate @payments, per_page: page_size).serializable_hash,
      leads: leads
    }
  end

  # This is for lead ledger
  def lead_payment_ledger
    @payments = QuotationPayment.includes(payment: :project).where(payments: {is_approved: true}).order(updated_at: :desc)
    leads = Lead.where(id: @payments.pluck(:lead_id)).order(name: :asc).map{|l| {id: l.id, name: l.name, email: l.email}}
    #filter
    @payments =  @payments.filter_by_lead(params[:lead_id]) if params[:lead_id].present?
    @payments =  @payments.filter_by_ageing(params[:ageing].to_i) if params[:ageing].present?
    if params[:from_date].present? || params[:to_date].present?
      from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
      @payments =  @payments.filter_by_date({from_time: from_time,to_time: to_time})
    end
    render json: {payment_ledger: CompletedPaymentSerializer.new(@payments).serializable_hash, leads: leads}
  end

  def final_stage_projects
    page_size = 10
    final_quotations = Quotation.where("paid_amount >= total_amount*0.45 OR per_50_approved_by_id IS NOT NULL").where(wip_status: "10_50_percent").joins(:payments).where(payments: {is_approved: true, payment_stage: "final_payment"})
    project_ids = final_quotations.pluck(:project_id).uniq
    if params[:status].present? && params[:status] == "pending"
      @projects = Project.where(id: project_ids).where(is_invoice_completed: false).order(id: :desc)
    else
      @projects = Project.where(id: project_ids).where(is_invoice_completed: true).order(id: :desc)
    end   
    page = params[:page].to_i
    if @projects.count < ((page - 1) * 10)
      params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
    end
    render json: {projects: ProjectForPaymentInvoiceSerializer.new(paginate @projects, per_page: page_size).serializable_hash}, status: 200
  end

  private

  def set_payment
    @payment = Payment.find params[:id]
  end

  def set_project
    @project = Project.find params[:project_id]
  end

  def payment_params
    params.require(:payment).permit(:id, :project_id, :quotation_id, :payment_type, :amount_to_be_paid, :mode_of_payment, :bank, :branch, :date_of_checque, :amount, :date, :is_approved, :payment_status, :image, :remarks, :payment_stage, :transaction_number, :purchase_element_ids, :ownerable_id, :ownerable_type)
  end
end
