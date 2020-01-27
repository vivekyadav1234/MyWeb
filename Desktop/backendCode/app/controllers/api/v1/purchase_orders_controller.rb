require "#{Rails.root.join('app','serializers','material_tracking_serializer')}"

class Api::V1::PurchaseOrdersController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :set_purchase_order, only: [:show, :update, :release_po, :cancel_purchase_order, :purchase_order_view, :generate_po_pdf, :purchase_order_view_for_finance, :modify_po, :release_modified_po, :raise_po_payment]
  load_and_authorize_resource

  def create
    boq = Quotation.find(params[:purchase_order][:quotation_id])
    vendor = Vendor.find(params[:purchase_order][:vendor_id])
    boq_purchase_orders_for_vendor = PurchaseOrder.where(quotation_id: boq.id, vendor_id: vendor.id)
    modifying_po = boq_purchase_orders_for_vendor.detect {|po| (po.status == 'pending') and po.modifying}
    if modifying_po.present?
      @purchase_order = modifying_po
      @purchase_order.purchase_elements.destroy_all
      params[:purchase_elements].flatten.each do |id|
        job_element_vendor = JobElementVendor.where(vendor_id: vendor.id, job_element_id: id).last
        @purchase_order.purchase_elements.where(job_element_vendor_id: job_element_vendor.id).first_or_create
      end

      @purchase_order.milestones.destroy_all
      if params[:purchase_order][:milestone_elements].present?
        params[:purchase_order][:milestone_elements].each do |object|
          if object["description"].present? && object["percentage_amount"].present?
            @purchase_order.milestones.create(percentage_amount: object["percentage_amount"], description: object["description"], estimate_date: object["estimate_date"])
          end
        end
      end
      @purchase_order.update_columns(vendor_gst: params[:purchase_order][:vendor_gst], contact_person: params[:purchase_order][:contact_person],
        shipping_address: params[:purchase_order][:shipping_address], contact_number: params[:purchase_order][:contact_number],
        billing_address: params[:purchase_order][:billing_address], billing_contact_number: params[:purchase_order][:billing_contact_number],
        billing_contact_person: params[:purchase_order][:billing_contact_person], movement: params[:purchase_order][:movement])
      @purchase_order.update_columns(status: "modified", modifying: false)
      render json: @purchase_order, status: 200
    else
      @purchase_order = PurchaseOrder.new(purchase_order_params)

      if @purchase_order.save!
        reference_no = "SFPL/PO/" + @purchase_order.id.to_s
        @purchase_order.update(reference_no: reference_no)
        params[:purchase_elements].flatten.each do |id|
          job_element = JobElementVendor.where(vendor_id: vendor.id, job_element_id: id).last
          @purchase_order.purchase_elements.create(job_element_vendor_id: job_element.id) if job_element.present?
        end

        if params[:purchase_order][:milestone_elements].present?
          params[:purchase_order][:milestone_elements].each do |object|
            if object["description"].present? && object["percentage_amount"].present?
              # @purchase_order.milestones.create(percentage_amount: object["percentage_amount"], interval: object["interval"])
              # commented above line to accomodate
              # client's change (have only one text field and percentage amount)
              @purchase_order.milestones.create(percentage_amount: object["percentage_amount"], description: object["description"], estimate_date: object["estimate_date"])
            end
          end
        end
        quotation = @purchase_order.quotation
        TaskEscalation.mark_done_task("Create Purchase Order", "50 %", quotation)

        if @purchase_order.status == "released"
          filepath = Rails.root.join("tmp", "purchase_order_#{@purchase_order.id}.pdf")
          @purchase_order.generate_purchase_order_pdf(current_user, filepath)
          UserNotifierMailer.send_purchase_order(filepath, current_user, @purchase_order).deliver_now!
          File.delete(filepath)
          TaskEscalation.mark_done_task("Purchse Order Release", "50 %", quotation)
        end
        render json: @purchase_order, status: 200
      else
        render json: @purchase_order.errors, status: :unprocessable_entity
      end
    end
  end

  def update
    vendor = Vendor.find(params[:purchase_order][:vendor_id])
    @purchase_order.purchase_elements.destroy_all
    params[:purchase_elements].each do |id|
      job_element = JobElementVendor.where(vendor_id: vendor.id, job_element_id: id).last
      @purchase_order.purchase_elements.where(job_element_vendor_id: job_element.id).first_or_create
    end

    @purchase_order.milestones.destroy_all
    if params[:milestone_elements].present?
      params[:milestone_elements].each do |object|
        if object["description"].present? && object["percentage_amount"].present?
          # @purchase_order.milestones.create(percentage_amount: object["percentage_amount"], interval: object["interval"])
          # commented above line to accomodate
          # client's change (have only one text field and percentage amount)
          @purchase_order.milestones.create(percentage_amount: object["percentage_amount"], description: object["description"])
        end
      end
    end
    @purchase_order.update_columns(status: "modified", modifying: false, updated_at: Time.now)
    render json: @purchase_order, status: 200
  end

  def line_items_for_po
    @quotation = Quotation.find(params[:quotation_id])

    if @quotation.present?
      if current_user.has_role? :order_manager
        render json: FjaPoSerializer.new(@quotation).serializable_hash
      else
        render json: FjaPoLineItemsSerializer.new(@quotation).serializable_hash
      end
    else
      render json: {}, status: 200
    end
  end

  def vendor_wise_line_items_for_po
     @quotation = Quotation.find(params[:quotation_id])
     if @quotation.present?
       render json: @quotation, serializer: PoLineItemsForVendorSerializer
     else
      render json: {}, status: 200
     end
  end

  def po_payment_list
    @quotation = Quotation.find(params[:quotation_id])
    if @quotation.present?
      render json: PoPaymentDetailsSerializer.new(@quotation).serializable_hash
    else
      render json: {}, status: 200
    end
  end

  def raise_po_payment
    if @purchase_order.present?
      performa_invoice = @purchase_order.performa_invoice
      amount = params[:amount].to_f
      if performa_invoice.balance >= amount
        percentage = ((amount * 100)/performa_invoice.total_amount.to_f).round(2)
        if performa_invoice.pi_payments.create!(created_by: current_user, payment_status: 'pending', amount: amount, description: "raised by category", percentage: percentage)
          render json: {message: "Payment Request raised"}, status: 200
        else
          render json: {message: "Cannot create Payment Request"}, status: 200
        end
      else
        render json: {message: "Amount exceeds the balance"}, status: :unprocessable_entity
      end
      
    else
      render json: {message: "Purchase Order Not Found"}, status: :unprocessable_entity
    end
  end

  #list of quotations having purchase orders.
  def quotations_for_order_manager
    @quotations = Quotation.where(id: PurchaseOrder.where(status: ["pending", "released"]).pluck(:quotation_id))

    if @quotations.present?
      # @quotations = paginate @quotations
      events = FjaPoQuotationSerializer.new(@quotations.includes(project: :lead)).serializable_hash

      temp_hash = {}
      temp_hash[:leads] = events.map { |event| event[:attributes] }

      render json: temp_hash
    else
      render json: {}, status: 200
    end
  end

  def panel_olt_payment_report
    PanelOltPaymentReportJob.perform_later(current_user)
  end

  def release_po
    if @purchase_order.status != "released"
      if (@purchase_order.status == "pending") and @purchase_order.modifying
        render json: {message: "PO in Modifying Mode"}, status: :unprocessable_entity
      else 
        @purchase_order.update(status: "released", modifying: false, release_count: @purchase_order.release_count + 1 )
        # adding condition for po released cost exceed form 65% boq cost
        quotation = @purchase_order.quotation
        released_po_ids  = quotation.purchase_orders.where(status: "released").pluck(:id)
        sixty_per_cost = quotation.total_amount.to_f * 0.65
        released_po_cost = quotation.purchase_orders.where(status: "released").map{|po| po.job_element_vendors.sum(:final_amount)}
        if released_po_cost.sum > sixty_per_cost
          ReleasedPoAlertJob.perform_later(quotation, released_po_ids)
        end
        filepath = Rails.root.join("tmp", "purchase_order_#{@purchase_order.id}.pdf")
        @purchase_order.generate_purchase_order_pdf(current_user, filepath)
        UserNotifierMailer.send_purchase_order(filepath, current_user, @purchase_order).deliver_now!
        File.delete(filepath)
        render json: @purchase_order
      end
    else
      render json: {message: "Already Released"}, status: :unprocessable_entity
    end
  end

  def modify_po
    if @purchase_order.payment_approved_or_pending?
      render json: {message: "Cannot modify PO, payment record present!!"}, status: :unprocessable_entity
    else
      if @purchase_order.mt_present?
        render json: {message: "Cannot modify PO, material tracking present!!"}, status: :unprocessable_entity
      else
        unless @purchase_order.modifying
          ActiveRecord::Base.transaction do
            begin
              @purchase_order.update_columns(status: "pending", modifying: true, updated_at: Time.now)
              jevs = @purchase_order.job_element_vendors
              jevs.each do |old_jev|
                old_je = old_jev.job_element
                new_je = old_je.dup
                random_name = old_je.element_name
                if old_je.no_master_sli?
                  loop do
                    new_random_name = random_name + '$clone$' + rand(10 ** 10).to_s
                    job_e_with_new_name = JobElement.find_by_element_name(new_random_name)
                    if job_e_with_new_name.present?
                    else
                      random_name = new_random_name
                      break
                    end
                  end
                end
                old_je.update_columns(po_cancelled_or_modifying: true, element_name: random_name)
                old_je.element_name
                new_je.save!
                new_jev = old_jev.dup
                new_jev.job_element_id = new_je.id
                new_jev.save!
                old_jev.update(po_cancelled_or_modifying: true)
              end
            end
          end
          render json: @purchase_order
        else
          render json: {message: "Already in modifying mode!!"}, status: :unprocessable_entity
        end
      end
    end
  end

  def release_modified_po
    if @purchase_order.status != "released"
      if (@purchase_order.status == "pending") and @purchase_order.modifying
        render json: {message: "PO in Modifying Mode"}, status: :unprocessable_entity
      else
        @purchase_order.update(status: "released", modifying: false, release_count: @purchase_order.release_count + 1)
        filepath = Rails.root.join("tmp", "purchase_order_#{@purchase_order.id}.pdf")
        @purchase_order.generate_purchase_order_pdf(current_user, filepath)
        UserNotifierMailer.send_modified_purchase_order(filepath, current_user, @purchase_order).deliver_now!
        File.delete(filepath)
        render json: @purchase_order
      end
    else
      render json: {message: "Already Released"}, status: :unprocessable_entity
    end
  end

  def cancel_purchase_order
    if @purchase_order.payment_approved_or_pending?
      render json: {message: "Cannot cancel PO, payment record present!!"}, status: :unprocessable_entity
    else
      if @purchase_order.mt_present?
        render json: {message: "Cannot cancel PO, material tracking present!!"}, status: :unprocessable_entity
      else
        ActiveRecord::Base.transaction do
          begin
            unless @purchase_order.modifying
              jevs = @purchase_order.job_element_vendors
              jevs.each do |old_jev|
                old_je = old_jev.job_element
                new_je = old_je.dup
                random_name = old_je.element_name
                if old_je.no_master_sli?
                  loop do
                    new_random_name = random_name + '$clone$' + rand(10 ** 10).to_s
                    job_e_with_new_name = JobElement.find_by_element_name(new_random_name)
                    if job_e_with_new_name.present?
                    else
                      random_name = new_random_name
                      break
                    end
                  end
                end
                old_je.update_columns(po_cancelled_or_modifying: true, element_name: random_name)
                old_je.element_name
                new_je.save!
                new_jev = old_jev.dup
                new_jev.job_element_id = new_je.id
                new_jev.save!
                old_jev.update(po_cancelled_or_modifying: true)
              end
            end
            @purchase_order.update(status: "cancelled")
            UserNotifierMailer.cancel_po(@purchase_order, current_user).deliver_now!
            if @purchase_order.status == "released"
              quotation = @purchase_order.quotation
              TaskEscalation.undo_mark_done_task("Purchse Order Release", "50 %", quotation)
              TaskEscalation.destroy_task(quotation)
              TaskEscalation.undo_mark_done_task("Create Purchase Order", "50 %", quotation)
            end
            render json: {message: "Purchase Order Canceled"}, status: 200
          end
        end
      end
    end
  end

  def purchase_order_view
    if @purchase_order.present?
      filepath = Rails.root.join("public").join("purchase_order_#{@purchase_order.id}.pdf")
      public_path = "/purchase_order_#{@purchase_order.id}.pdf"
      @purchase_order.generate_purchase_order_pdf(current_user, filepath)
      hash = Hash.new
      hash[:path] = public_path
      render json: hash, status: 200
    else
      render json: {message: "Purchase Order Not Present"}, status: 404
    end
  end

  # this will give details of purchase order to finance.
  def purchase_order_view_for_finance
    if @purchase_order.present?
      render json: PurchaseOrderSerializer.new(@purchase_order).serializable_hash
    else
      render json: {message: "Purchase Order Not Present"}, status: 404
    end
  end

  def delete_purchase_order_view
    begin
      if params[:filepath].present?
        params[:filepath].slice!(0)
        filepath = Rails.root.join("public").join("#{params[:filepath]}")
        File.delete(filepath)
        render json: {message: "File Deleted"}, status: 200
      else
        render json: {message: "File Not Found"}, status: 404
      end
    rescue => error
      render json: {message: "File Not Found"}, status: 404
    end

  end

  def generate_po_pdf
    if @purchase_order.present?
      filepath = Rails.root.join("tmp", "purchase_order_#{@purchase_order.id}.pdf")
      po_pdf = @purchase_order.generate_purchase_order_pdf(current_user, filepath)
      render json: {po_pdf: po_pdf}, status: 200
    else
      render json: {message: "Purchase Order Not Found"}, status: 404
    end
  end

  def download_sli_report
    SliReportJob.perform_later(current_user)
  end

  def purchase_order_report
    PurchaseOrderJob.perform_later(current_user)
  end

  def po_details
    po = PurchaseOrder.find params[:id]
    clubbed_job_elements = po.job_elements.unscope(where: :added_for_partial_dispatch).where.not(ownerable_type: JobElement).group_by do |je|
      jev = je.job_element_vendors.last
      if je.added_for_partial_dispatch
        [je.vendor_product_id, "#{je.element_name}- #{je.id}", je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
      else
        [je.vendor_product_id, je.element_name, je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
      end
    end
    response = []
    clubbed_job_elements.each do |common_values, clubbed_slis|
      #data = Hash.new
      je_for_data = clubbed_slis.last
      data = JSON.parse(MaterialTrackingPoDetails.new(je_for_data).to_json)
      data[:clubbed_ids] = clubbed_slis.pluck(:id)
      data[:clubbed_ids].delete(je_for_data.id)
      data[:child_job_elements] = JobElement.unscope(where: :added_for_partial_dispatch).where(ownerable: je_for_data).map do |je| 
        data1 = JSON.parse(MaterialTrackingPoDetails.new(je).to_json)
        data1[:clubbed_ids] = [] ### added just for format integrity
        data1
      end
      data[:quantity] = clubbed_slis.map{|je| je.quantity}.sum.round(2)
      response.push(data)
    end
    # byebug
    render json: {job_elements: response}
    #render json: po.job_elements.unscope(where: :added_for_partial_dispatch), each_serializer: MaterialTrackingPoDetails
  end


  private

  # Use callbacks to share common setup or constraints between actions.
  def set_purchase_order
    @purchase_order = PurchaseOrder.find(params[:id])
  end

  #Use only trusted parameters
  def purchase_order_params
    params.require(:purchase_order).permit(:project_id, :vendor_id, :quotation_id, :status, :contact_person, :shipping_address, :contact_number,
      :billing_address,:billing_contact_person, :billing_contact_number, :vendor_gst, :movement, :tag_snag)
  end
end
