require "#{Rails.root.join('app','serializers','proposal_serializer')}"
require "#{Rails.root.join('app','serializers','proposal_doc_serializer')}"
require "#{Rails.root.join('app','serializers','client_quotation_serializer')}"
class Api::V1::ProposalsController < Api::V1::ApiController
  before_action :authenticate_user!
  before_action :set_proposal, only: [:show, :update, :destroy, :share_with_customer,:add_ownerables_to_proposal]

  def boqs_shared_with_clients
    @quotation =  Quotation.joins(:proposals).where(proposals: {proposal_type: "initial_design", project_id: params[:project_id]}, status: "shared").distinct
    if @quotation.present?
      render json: ClientQuotationSerializer.new(@quotation).serializable_hash, status: 200
    else
      render json: {message: "No Record Found"}, status: 204
    end
  end

  def get_book_order_detail
    @quotation = Quotation.find params[:quotation_id]
    render json: ClientQuotationBookOrderSerializer.new(@quotation).serializable_hash, status: 200
  end

  def get_finalize_design_details
    @quotation = Quotation.joins(:proposals).where(proposals: {proposal_type: "final_design"}, parent_quotation_id: params[:quotation_id], status: "shared", is_approved: [nil, true]) # removed cm approval and catagory approval is no longer needed.
    render json: ClientFinalQuotationSerializer.new(@quotation).serializable_hash, status: 200
  end

  # GEt Projects
  def boq_approved_project_list
    if current_user.has_role? :finance
      # @proposal_docs = ProposalDoc.where(is_approved: "yes")
      # project_ids = @proposal_docs.map { |proposal_doc| proposal_doc.proposal.project_id }.uniq.compact
      # @projects = Project.where(id: project_ids)
      @projects = Project.where(id: ProposalDoc.where(is_approved: "yes").joins(:proposal).pluck("proposals.project_id").uniq.compact).includes(:payments, :user)
      render json: @projects, each_serializer: ProjectSerializerForFinance
    else
      render json: { message: "This user is not a financiar!" }, status: :unauthorized
    end
  end


  # Get Approved Proposals
  def proposal_list_for_finance
    if current_user.has_role? :finance
      @proposal_docs = ProposalDoc.where(is_approved: "yes")
      proposal_ids = @proposal_docs.map { |proposal_doc| proposal_doc.proposal.id }.uniq.compact
      @proposals = Proposal.where(id: proposal_ids,project_id: params[:project_id])
      hash_to_render = ActiveModelSerializers::SerializableResource.new(@proposals, each_serializer: ProposalForFinanceSerializer).serializable_hash
      hash_to_render[:project] = @proposals.first.project.slice(:id,:name)
      render json: hash_to_render
    else
      render json: { message: "This user is not a financiar!" }, status: :unauthorized
    end
  end

  # GET /proposals

  def index
    if current_user.has_role?(:customer)
      @proposals = Proposal.where(proposal_status: "proposal_shared",project_id: params[:project_id])
    elsif current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
      @proposals = Proposal.where(is_draft: "no",proposal_type: params[:proposal_type],project_id: params[:project_id])
    elsif current_user.has_role?(:designer)
      @proposals = Proposal.where(proposal_type: params[:proposal_type],project_id: params[:project_id])
    end
    render json: @proposals
  end

  def quotation_types
    project = Project.find params[:project_id]
    proposal_type = params[:proposal_type].present? ? params[:proposal_type] : "all"
    proposals = proposal_type == "all" ? project.proposals.pluck(:id) : project.proposals.where(proposal_type: proposal_type).pluck(:id)
    proposal_docs_owner = ProposalDoc.where(proposal_id: proposals, ownerable_type: "Quotation").pluck(:ownerable_id)
    quotations = Quotation.where(id: proposal_docs_owner)
    render  json: quotations, each_serializer: QuotationSerializer
  end

  def drafted_or_saved_proposals
    if current_user.has_any_role?(:designer, :community_manager)
      @proposals = current_user.proposals.where(project_id: params[:project_id],proposal_type: params[:proposal_type], is_draft: params[:is_draft])
      render json: @proposals
    else
      render json: { message: "This user is not a Designer!" }, status: :unauthorized
    end

  end

  def submitted_proposals
    if current_user.has_role?(:community_manager)
      designers = current_user.designers_for_cm.pluck(:id)
      @proposals = Proposal.where(project_id: params[:project_id],designer_id: designers,proposal_type: params[:proposal_type], proposal_status: "proposal_shared")
    elsif current_user.has_any_role?(:city_gm, :design_manager, :business_head)
      @proposals = Proposal.where(project_id: params[:project_id], proposal_type: params[:proposal_type], proposal_status: "proposal_shared")
    elsif current_user.has_role?(:designer)
      @proposals = current_user.proposals.where(project_id: params[:project_id],proposal_type: params[:proposal_type], proposal_status: "proposal_shared")
    end
    render json: @proposals
  end

  def all_approved_boqs_of_project
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      @proposal = Proposal.where(project_id: params[:project_id])
      @proposal_docs = ProposalDoc.where(proposal_id: @proposal,ownerable_type: "Quotation",is_approved: true)
      render json: @proposal_docs
    else
      render json: { message: "This user is not a Category" }, status: :unauthorized
    end
  end

  def category_boqs_of_project
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      proposal_type = params[:proposal_type].present? ? params[:proposal_type] : "all"
      proposals = Proposal.where(project_id: params[:project_id], proposal_type: proposal_type)
      @proposal_docs = ProposalDoc.where(proposal_id: proposals, ownerable_type: "Quotation")
      render json: @proposal_docs
    else
      render json: { message: "This user is not a Category" }, status: :unauthorized
    end
  end

  def approved_or_rejected_boqs
    if current_user.has_any_role?(:community_manager,:designer,:finance)
      @proposal = Proposal.find params[:proposal_id]
      @proposal_docs = @proposal.proposal_docs.where(ownerable_type: params[:ownerable_type])
      if params[:is_approved].present?
        @proposal_docs = @proposal_docs.where(is_approved: params[:is_approved])
      end
      # @proposal_docs = proposal_docs.map { |proposal_doc| proposal_doc if proposal_doc.ownerable.status != "expired" }.uniq.compact
      render json: @proposal_docs
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  def payment_details_for_boq
    if current_user.has_any_role?(:designer,:finance, :customer, :community_manager)
      @quotation = Quotation.find params[:quotation_id]
      if current_user.has_role? :finance
       @payment = @quotation.payments.where(payment_status: "done")
      else
       @payment = @quotation.payments
      end
      render json: @payment, status: 200
    else
      render json: { message: "This user is not a financiar or designer" }, status: :unauthorized
    end
  end

  def payment_approval_by_financiar
    if current_user.has_role? :finance
      @payment = Payment.find params[:payment_id]
      if @payment.present?
        if @payment.update_attributes!(is_approved: params[:is_approved])
          render json: @payment, status: 200
        else
          render json: @payment.errors, status: 400
        end
      else
      render json: { message: "Payment Not Found" }, status: :unauthorized
      end
    else
      render json: { message: "This user is not a financiar" }, status: :unauthorized
    end
  end

  def expired_boqs
    if current_user.has_role?(:community_manager, :city_gm, :design_manager, :business_head)
      @proposals = Proposal.where(project_id: params[:project_id],id: params[:proposal_id])
      proposal_docs = ProposalDoc.where(proposal_id: @proposals,ownerable_type: "Quotation")
      @proposal_docs = proposal_docs.map { |proposal_doc| proposal_doc if proposal_doc.ownerable.status == "expired" }.uniq.compact
      render json: @proposal_docs
    elsif current_user.has_role?(:designer)
      proposal_doc_ids = current_user.proposals.where(project_id: params[:project_id],id: params[:proposal_id]).map {|proposals| proposals.proposal_docs.pluck(:ownerable_id)}.flatten
      proposal_docs = ProposalDoc.where(id: proposal_doc_ids,ownerable_type: "Quotation")
      @proposal_docs = proposal_docs.map { |proposal_doc| proposal_doc if proposal_doc.ownerable.status == "expired" }.uniq.compact
      render json: @proposal_docs
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  def discount_proposed_boq
    if current_user.has_any_role?(:community_manager,:designer, :city_gm, :design_manager, :business_head)
      @proposals = Proposal.where(project_id: params[:project_id],proposal_status: "proposal_for_discount",is_draft: "no")
      # @proposal_docs = ProposalDoc.where(proposal_id: @proposals.pluck(:id),ownerable_type: "Quotation")
      render json: @proposals , status: 200
    else
      render json: { message: "This user is not a Community Manager" }, status: :unauthorized
    end

  end


  # GET /proposals/1
  def show
    render json: @proposal
  end

# Get the BOQs and PPTs
  def get_ownerables_for_proposals
    if current_user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
      proposed_quotations = Proposal.includes(:proposal_docs).where("proposal_docs.ownerable_type = ? AND project_id = ?", "Quotation",params[:project_id]).pluck(:ownerable_id)
      if params[:proposal_type] == "initial_design"
        rejected_quotatons = Quotation.where(id: proposed_quotations, is_approved: false).pluck(:id)
        @quotations1 = Quotation.where(project_id: params[:project_id],status: "pending",parent_quotation_id: nil).where.not(id: proposed_quotations).pluck(:id)
        @quotations2 = Quotation.where(project_id: params[:project_id],status: "pending",parent_quotation_id: rejected_quotatons).where.not(id: proposed_quotations).pluck(:id)
        @quotations = Quotation.where(id: @quotations1 + @quotations2)
      elsif params[:proposal_type] == "final_design"
        approved_quotatons = Quotation.where(id: proposed_quotations, is_approved: true).pluck(:id)
        @quotations = Quotation.where(project_id: params[:project_id],status: "pending",parent_quotation_id: approved_quotatons).where.not(id: proposed_quotations,parent_quotation_id: nil)
      end
      @presentations = Presentation.where(project_id: params[:project_id])
      @uploaded_presentations = BoqAndPptUpload.where(project_id: params[:project_id], upload_type: "ppt")
      hash = Hash.new
      hash[:quotations] = @quotations.map{|quotation| quotation.attributes.slice('id', 'name', 'reference_number','status','expiration_date', 'updated_at','net_amount', 'discount_value', 'total_amount').merge("pm_fee": quotation.total_pm_fee.round(2))}
      hash[:presentations] = @presentations.map{|presentation| presentation.attributes.slice('id', 'title', 'ppt_file_name','updated_at')}
      hash[:uploaded_presentations] = @uploaded_presentations.map{|u_presentation| u_presentation.attributes.slice('id', 'name', 'upload_file_name','updated_at')}
      render json: hash
    else
      render json: { message: "This user is not a Designer!" }, status: :unauthorized
    end
  end

  # POST /proposals
  def create
    if current_user.has_any_role?(:designer, :community_manager,:city_gm, :design_manager, :business_head)
      project = Project.find params[:proposal][:project_id]
      flag = 0
      if params[:proposal][:proposal_type] == "final_design"
        if project.proposals.present? && project.proposals.where(proposal_type: "initial_design").present?
          flag = 1
        else
          flag = 0
        end
      else
          flag = 1
      end
      if flag ==1
        ActiveRecord::Base.transaction do
          begin
            last_proposal = project.proposals&.where(proposal_type:  params[:proposal][:proposal_type])&.order("created_at ASC")&.last
            if last_proposal.present? && last_proposal.proposal_type == params[:proposal][:proposal_type]
              name = last_proposal.proposal_name
              name[-1] = name[-1].succ
            else
              name = params[:proposal][:proposal_type] + "_proposal_r1"
            end
            proposal = current_user.proposals.create!(proposal_params)
            proposal.update_attributes(proposal_name: name)
            proposal.add_ownerables(params[:"ownerables"].as_json,  current_user.id)
            # proposal.add_ownerables(new_boq.as_json)
            if proposal.save!
              if proposal.is_draft == "no"
                proposal.manage_task_sets
                UserNotifierMailer.proposal_created_mail_to_cm_and_category(proposal,current_user).deliver_now! if current_user.has_role?(:designer)
              end
              render json: proposal, status: :created
            else
              render json: proposal.errors, status: :unprocessable_entity
            end
            # proposal.update_attributes(proposal_status: "sent_for_approval")  if proposal.proposal_type == "final_design"
          end
        end
      else
        render json: {message: "No Initial Proposal Accepted by the customer"}, status: 403
      end
    else
      render json: { message: "This user is not a Designer!" }, status: :unauthorized
    end
  end

  def aprove_or_reject_or_change_discount
    @proposal_doc = ProposalDoc.find params[:proposal_doc_id]
    @quotation = @proposal_doc.ownerable if @proposal_doc.ownerable.class.name == "Quotation"
    @proposal = @proposal_doc.proposal
    if current_user.has_any_role?(:city_gm, :business_head, :community_manager) && @proposal_doc.proposal.proposal_status != "proposal_shared"
      if params[:discount_value].present?
        @proposal_doc.discount_value = params[:discount_value]
        @quotation.discount_value = params[:discount_value] if @quotation.present?
      end
      
      # if params[:discount_status].present? 
      #   if current_user.has_role? :city_gm
      #     if @quotation.approvals.where(approval_scope: "discount").where(role: 'community_manager').present?
      #       #Saving General Manager approval for BOQ 
      #       @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, 
      #         approved_at: DateTime.now)
      #       # If the discount_value is up to the max allowed for this role, then no further approval is needed.
      #       # So, update the quotation discount related columns.
      #       if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:city_gm] )
      #         set_quotation_discount_columns
      #       end
      #     else
      #       return render json: { message: "Sorry! You can not approve the discount because CM approval is pending" }, status: 200
      #     end
      #   elsif current_user.has_role? :business_head
      #     if @quotation.approvals.where(approval_scope: "discount").where(role: 'city_gm').present?
      #       #Saving Business Head approval for BOQ 
      #       @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
      #       # If the discount_value is up to the max allowed for this role, then no further approval is needed.
      #       # So, update the quotation discount related columns.
      #       if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:business_head] )
      #         set_quotation_discount_columns
      #       end
      #     else
      #       return render json: { message: "Sorry! You can not approve the discount because GM approval is pending" }, status: 200
      #     end
      #   elsif current_user.has_role? :community_manager
      #     @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
      #     # If the discount_value is up to the max allowed for this role, then no further approval is needed.
      #     # So, update the quotation discount related columns.
      #     if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:community_manager] )
      #       set_quotation_discount_columns
      #     end
      #   end          
      # end

      if params[:discount_status].present? 
        if current_user.has_role? :city_gm
          if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:city_gm]  && @proposal_doc.discount_value.to_f > Proposal::DISCOUNT_THRESHOLD[:community_manager])
            set_quotation_discount_columns
            @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
          else
            @proposal_doc.save!
            @quotation.save!
            UserNotifierMailer.complete_discount_approval_email(@quotation).deliver
            return render json: { message: "Sorry! Discount needs to be approved from Community Manager or Business Head or Designer" }, status: 200
          end
        elsif current_user.has_role? :business_head
          if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:business_head] &&  @proposal_doc.discount_value.to_f > Proposal::DISCOUNT_THRESHOLD[:city_gm])
            set_quotation_discount_columns
            @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
          else
            @proposal_doc.save!
            @quotation.save!
            UserNotifierMailer.complete_discount_approval_email(@quotation).deliver            
            return render json: { message: "Sorry! Discount needs to be approved from Community Manager or General Manager or Designer" }, status: 200
          end
        elsif current_user.has_role? :community_manager
          if ( @proposal_doc.discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:community_manager] && @proposal_doc.discount_value.to_f >Proposal::DISCOUNT_THRESHOLD[:designer])
            set_quotation_discount_columns
            @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
          else
            @proposal_doc.save!
            @quotation.save! 
            UserNotifierMailer.complete_discount_approval_email(@quotation).deliver           
            return render json: { message: "Sorry! Discount needs to be approved from General Manager or  Business Head or Designer" }, status: 200
          end
        end  
      end

      if @proposal_doc.save!  && @quotation.save!
        if @quotation.discount_status == 'accepted'
          UserNotifierMailer.discount_approved(@quotation).deliver
          if @quotation.discount_value > 10
            UserNotifierMailer.discount_alert(@quotation).deliver
          end
        else
          #To notify General Manager and Business Head about discount value
          UserNotifierMailer.complete_discount_approval_email(@quotation).deliver
        end
        # To be removed once we move from Proposal Doc to Quotation
        all_proposal_docs = @proposal.proposal_docs.where(discount_status: "proposed_for_discount")
        if !all_proposal_docs.present?
          @proposal.update_attributes!(proposal_status: "pending")
        end
        render json: { message: "Proposal Document Updated Succesfully" }, status: 200
      end 
    elsif current_user.has_role?(:designer) && @proposal.proposal_status != "proposal_shared"
      discount_value = params[:discount_value].present? ? @proposal_doc.discount_value = params[:discount_value] : @proposal_doc.discount_value.to_f
      @quotation.discount_value = discount_value
      params[:discount_status] = (discount_value.to_f <= Proposal::DISCOUNT_THRESHOLD[:designer]) ? "accepted" : "proposed_for_discount"
      if params[:discount_status] == "accepted"
        set_quotation_discount_columns
        @quotation.approvals.create!(approval_scope: "discount", approved_by: current_user.id, role: current_user.roles.last.name, approved_at: DateTime.now)
      else
        @proposal_doc.discount_status = params[:discount_status]
        @quotation.discount_status = params[:discount_status]
        UserNotifierMailer.complete_discount_approval_email(@quotation).deliver 
      end
      if @proposal_doc.save! && @quotation.save!
        all_proposal_docs = @proposal.proposal_docs.where(discount_status: "proposed_for_discount")
        if !all_proposal_docs.present?
          @proposal.update_attributes!(proposal_status: "pending")
        end
        if @quotation.discount_status == "accepted" && @proposal_doc.discount_status == "accepted"
          render json: { message: "Proposal Approved" }, status: 200
        elsif @quotation.discount_status == "proposed_for_discount"
          render json: { message: "You can not approve this discount" }, status: 200
        else  
          render json: { message: "Proposal Document Updated Succesfully" }, status: 200
        end
      else
        render json: { message: "Pass the Proper parameters" }, status: :unauthorized
      end
    else
      render json: { message: "This user is not a CM, GM, Business Head or Designer." }, status: :unauthorized
    end
  end

  def share_with_customer
    if current_user.has_any_role?(:community_manager,:designer, :city_gm, :design_manager, :business_head)
      discount_status = @proposal.proposal_docs.pluck(:discount_status)
      # Check if the quotations in the proposal are valid. Added in Aug 2019 with addon validations.
      # 25 Aug 2019 - Disabled this check on Abhishek's request.
      # @proposal.quotations.each do |quotation|
      #   unless quotation.addons_eligible_for_share?
      #     return render json: { message: "This proposal cannot be shared because BOQ #{quotation.reference_number} has missing mandatory addons or invalid addons. Please edit the BOQ." }, status: :unprocessable_entity
      #   end
      # end
      # Discount check.
      if discount_status.any? { |x| ["proposed_for_discount","rejected"].include?(x) }
        render json: { message: "This Proposal can not be shared because it may contain rejected or discount proposed boqs " }, status: :unauthorized
      else
        if @proposal.proposal_type == "final_design"
          project = @proposal.project
          ProjectQualityCheck::ALLOWED_TYPES.each do |qc_type|
            qc = project.project_quality_checks.where(qc_type: qc_type).last
            if qc.present?
                if qc.status == false
                  return render json: {message: "#{qc_type.titleize} has not been passed by category"}, status: 403
                end
            else
              return render json: {message: "#{qc_type.titleize} not present"}, status: 403
            end
          end
          # unless project.line_markings.present?
          #   return render json: {message: "Line Marking not added to project"}, status: 403
          # end

          q_check = @proposal.quotations_check
          if q_check.present?
            return render json: {message: q_check}, status: 403
          end
        end
        @proposal.update_attributes!(proposal_status: "proposal_shared",sent_at: Time.zone.now)
        @proposal.manage_task_for_sharing
        @proposal.increment_units_sold_count
        customer_viewing_option = params[:customer_viewing_option].present? ? JSON.parse(params[:customer_viewing_option]) : ["boq"]
        @proposal.quotations.each do |quotation|
          if @proposal.proposal_type == "initial_design"
            @proposal.project.creation_of_first_call_with_gm
            quotation.update(status: "shared", customer_viewing_option: customer_viewing_option.uniq)
          elsif @proposal.proposal_type == "final_design" #&& quotation.cm_approval && quotation.category_approval
            quotation.update(status: "shared", customer_viewing_option: customer_viewing_option.uniq)
          end
        end


        UserNotifierMailer.proposal_shared_mail_to_customer(@proposal).deliver_now!
        UserNotifierMailer.proposal_shared_mail_to_arrivae(@proposal).deliver_now!

        # app push notification starts here
        notificationHash =  {
                              title: "Congratulations for your lead qualification",
                              body:"Your customer lead has been contacted and given a quotation. This makes you eligible for payment. Please visit the wallet section of the app."
                            }
        notificationEmail = User.find(@proposal.project.lead.created_by).email rescue "email"
        MobileAppNotificationsJob.perform_later(notificationEmail,notificationHash,"Wallet")
        # notification code end

        project_sub_status = Project::ALLOWED_SUB_STATUSES
        if  @proposal.proposal_type == "initial_design"
          @proposal.project.update_column("sub_status", "initial_proposal_submitted") if (project_sub_status.index("initial_proposal_submitted") > project_sub_status.index(@proposal.project.sub_status).to_i)
        else
          @proposal.project.update_attributes!(sub_status: "final_proposal_submitted") if (project_sub_status.index("final_proposal_submitted") > project_sub_status.index(@proposal.project.sub_status).to_i)
        end
        render json: @proposal , status: 200
      end
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  def approve_or_reject_the_boq
    if current_user.has_any_role?(:customer, :community_manager, :city_gm, :design_manager, :business_head)
      @proposal_doc = ProposalDoc.find params[:proposal_doc_id]
      @quotation = @proposal_doc.ownerable if @proposal_doc.ownerable_type == "Quotation"
      @proposal = @proposal_doc.proposal
      @proposal_doc.is_approved = params[:is_approved]
      if @quotation.present?
        @quotation.update(is_approved: params[:is_approved], client_approval_by_id: current_user.id, client_approval_at: DateTime.now)
        @quotation.clone if !params[:is_approved] && !@quotation.copied
      end
      @task_set = TaskEscalation.find_by(ownerable: @quotation, task_set: TaskSet.where(task_name: "Client Approval"), status: "no")
      @task_set.update(status: "yes", completed_at: DateTime.now) if @task_set.present?
      if @quotation.is_approved
        @task_set_scope = TaskEscalation.where(ownerable: @quotation.project, task_set_id: TaskSet.where(task_name: ["Scope Checklist"]).pluck(:id))
        TaskEscalation.invoke_task(["Scope Checklist"], "10 %", @quotation.project) if !@task_set_scope.present?
        # TaskEscalation.invoke_task(["Payment Addition"], "10 %", @quotation)
      end

      @proposal_doc.remark = params[:remark]
      @proposal_doc.approved_at = DateTime.now if params[:is_approved] == true

      ## check if customer remark present?
      if params[:customer_remark].present?
        @proposal_doc.customer_remark = params[:customer_remark]
      end

      # if params[:is_approved] == true
      #   @proposal_doc.approved_at = DateTime.now
      #   if @proposal.proposal_type == "initial_design"
      #     @proposal.project.update_attributes!(sub_status: "initial_proposal_accepted")
      #   elsif @proposal.proposal_type == "final_design"
      #     @proposal.project.update_attributes!(sub_status: "final_proposal_accepted")
      #   end
      # else
      #   if @proposal.proposal_type == "initial_design"
      #     @proposal.project.update_attributes!(sub_status: "initial_proposal_rejected")
      #   elsif @proposal.proposal_type == "final_design"
      #     @proposal.project.update_attributes!(sub_status: "final_proposal_rejected")
      #   end
      #   @proposal.quotations.each do |boq|
      #     boq.update(status: "rejected")
      #     boq.clone
      #   end
      # end
      project_sub_status = Project::ALLOWED_SUB_STATUSES
      if @proposal.proposal_type == "initial_design"
        TaskEscalation.invoke_task(["Payment Addition"], "10 %", @quotation) if params[:is_approved]
        @proposal.project.update_column("sub_status", "initial_proposal_rejected") if !params[:is_approved] && project_sub_status.index("initial_proposal_rejected") > project_sub_status.index(@proposal.project.sub_status).to_i
        @proposal.project.update_column("sub_status", "initial_proposal_accepted") if params[:is_approved] && project_sub_status.index("initial_proposal_accepted") > project_sub_status.index(@proposal.project.sub_status).to_i
      elsif @proposal.proposal_type == "final_design"
        TaskEscalation.invoke_task(["Payment Addition"], "10% - 40%", @quotation) if params[:is_approved]
        @proposal.project.update_column("sub_status", "final_proposal_rejected") if !params[:is_approved] && project_sub_status.index("final_proposal_rejected") > project_sub_status.index(@proposal.project.sub_status).to_i
        @proposal.project.update_column("sub_status", "final_proposal_accepted") if params[:is_approved] && project_sub_status.index("final_proposal_accepted") > project_sub_status.index(@proposal.project.sub_status).to_i
      end
      UserNotifierMailer.proposed_boq_aproved(@proposal_doc,current_user).deliver_now!
      if @proposal_doc.save! && (@quotation.present? && @quotation.save!)
        render json: { message: "BOQ approved : #{@proposal_doc.is_approved}" }, status: 200
      else
        render json: @proposal.errors, status: :unprocessable_entity
      end
    else
      render json: { message: "This user is not a Customer" }, status: :unauthorized
    end

  end

  def add_payment
    if current_user.has_any_role?(:community_manager,:designer)
      if params[:quotations].present?
        amount = params[:paid_amount].to_f
        ActiveRecord::Base.transaction do
         begin
            @quotation = Quotation.find params[:quotations]
            @payment = @quotation.payments.find_by_payment_type(params[:payment_type])
            @payment.update_columns(mode_of_payment: params[:mode_of_payment],bank: params[:bank],branch: params[:branch],date_of_checque: params[:date_of_checque],amount: amount,date: params[:date],payment_status: "done")
            if params[:image].present?
              @payment.update_attributes!(image: params[:image])
            end
            render json: @payment,status: 200
         end
        end
      else
        render json: { message: "Pass Quotation" }, status: 400
      end
    else
      render json: { message: "This user is not a Designer" }, status: :unauthorized
    end
  end

  def designer_cm_details
    if current_user.has_role?(:customer)
        @project = Project.find params[:project_id]
        @designer = @project.assigned_designer
        @cm = @designer.cm
        hash = Hash.new
        hash[:designer] = @designer.attributes.slice('id','name','email','contact', 'extension')
        hash[:designer][:avatar] =  @designer.avatar.url
        hash[:community_manager] = @cm.attributes.slice('id','name','email','contact', 'extension')
        hash[:community_manager][:avatar] = @cm.avatar.url
        render json:  hash
    else
      render json: { message: "This user is not a Designer" }, status: :unauthorized
    end
  end

  def add_ownerables_to_proposal
    if current_user.has_any_role?(:designer, :community_manager)

      if @proposal.present?
        @proposal.add_ownerables(params[:ownerables].as_json) if params[:ownerables].present?
        if params[:ownerables_for_update].present?
          params[:ownerables_for_update].each do |ownerables_for_update|
            proposal_doc_hash = ownerables_for_update.as_json
            @proposal_doc = ProposalDoc.find proposal_doc_hash["proposal_doc_id"].to_i
            @proposal_doc.discount_value = proposal_doc_hash["discount_value"] if proposal_doc_hash["discount_value"].present?
            @proposal_doc.discount_status = "proposed_for_discount" if proposal_doc_hash["discount_value"].present?
            @proposal_doc.save!
          end
        end
        @proposal.update_attributes(is_draft: params[:is_draft])
        @proposal.manage_task_sets if @proposal.is_draft == "no"
        render json: @proposal, status: 200
      else
        render json: {message: "Proposal Id is must"}, status: 400
      end
    else
      render json: { message: "This user is not a Designer" }, status: :unauthorized
    end
  end

  def destroy_proposal_docs
    if current_user.has_role?(:designer, :community_manager)
        @proposal_doc = ProposalDoc.find params[:proposal_doc_id]
       if @proposal_doc.destroy!
         render json: {message: "Deleted Proposal Document "}, status: 200
       else
         render json: {message: "Pass Proper Proposal Doc Id"}, status: 400
       end

    else
      render json: { message: "This user is not a Designer" }, status: :unauthorized
    end

  end

  # PATCH/PUT /proposals/1
  def update
    if current_user.has_any_role?(:designer, :community_manager) && @proposal.proposal_status != "proposal_shared"
      ActiveRecord::Base.transaction do
        begin

          if @proposal.update(proposal_params)
            render json: @proposal
          else
            render json: @proposal.errors, status: :unprocessable_entity
          end
        end
      end
    else
      render json: { message: "This user is not a Designer or u can not edit shared proposal" }, status: :unauthorized
    end
  end

  def customer_logs
    unless current_user.has_any_role?(:admin, :customer, :community_manager, :designer)
      return render json: {message: 'Unauthorized!'}, status: :unauthorized
    end
    @lead = Lead.find params[:lead_id]
    render json: @lead, serializer: LeadLogSerializer
  end

  def schedule_call_with_designer
    if current_user.has_role?(:customer)
      @project = Project.find params[:project_id]
      @designer = @project.assigned_designer
      @event = current_user.events.create!(scheduled_at: params[:scheduled_at],description: params[:description], agenda: "client_request", status: "scheduled", ownerable: @project, contact_type: "phone_call")
      event_user = current_user.event_users.find_by_event_id @event
      event_user.update_attributes!(host: 1)
      participants = @event.event_users.build(user_id: @designer.id, host: 0)
      participants.save!
      if @event.save!
        UserNotifierMailer.event_created_email(@event,@designer).deliver_later!(wait: 15.minutes)
        UserNotifierMailer.event_reminder(@event,@designer).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
        UserNotifierMailer.event_reminder(@event,current_user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
        SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", @designer.contact)
        SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", current_user.contact)
        render json: @event, status: 200
      else
        render json: @event.errors, status: 400
      end
    else
      render json: { message: "This user is not a Customer" }, status: :unauthorized
    end
  end

  def list_of_scheduled_calls
    if current_user.has_role?(:customer)
      @events = current_user.events.where(agenda: ["client_request","follow_up","follow_up_for_not_contactable"],ownerable_type: "Project",ownerable_id: params[:project_id])
      if params[:status].present?
        @events = @events.where(status: params[:status])
      end
      render json: @events , status: 200
    else
      render json: { message: "This user is not a Customer" }, status: :unauthorized
    end

  end

  # DELETE /proposals/1
  def destroy
    if @proposal.present?
      @proposal.destroy_tasks if @proposal.is_draft == "no"
      @proposal.destroy
    else
      render json: {message: "Something went wrong"}
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_proposal
      @proposal = Proposal.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def proposal_params
      params.require(:proposal).permit(:proposal_type, :proposal_name, :project_id, :designer_id, :sent_at, :is_draft)
    end

    def proposal_doc_params
      params.require(:proposal_doc).permit(:ownerable_type,:ownerable_id,:discount_value)
    end

    def set_quotation_discount_columns
      @proposal_doc.discount_status = params[:discount_status]
      @quotation.discount_status = params[:discount_status]
      @proposal.manage_discount_task(@quotation)
      @proposal_doc.disc_status_updated_at = DateTime.now
      @proposal_doc.disc_status_updated_by = current_user.id
      @quotation.disc_status_updated_at = DateTime.now if @quotation.present?
      @quotation.disc_status_updated_by = current_user.id if @quotation.present?
    end
end
