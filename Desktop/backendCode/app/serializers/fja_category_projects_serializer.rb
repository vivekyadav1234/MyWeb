class FjaCategoryProjectsSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :name

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :designer_details do |object|
    object.assigned_designer.slice(:id, :name, :email) if object.assigned_designer.present?
  end

  attribute :lead_details do |object|
    object.lead&.slice(:id, :name, :email) 
  end

  attribute :cm_details do |object|
    object.assigned_designer&.cm&.slice(:id, :name, :email)
  end

  attribute :approval_required do |object|
    quotations_ids = Project.joins(proposals: :proposal_docs).where(proposal_docs: {ownerable_type: "Quotation"}, proposals: {project_id: object.id, proposal_type: "final_design"} ).pluck(:ownerable_id).uniq
    quotations = Quotation.find(quotations_ids) if quotations_ids.present?
    quotations.present? ? quotations.pluck(:category_approval).include?(nil) : false
  end

  attribute :custom_element_approval_required do |object|
    object.custom_elements.pluck(:status).include?("pending")
  end

  attribute :cad_approvals_required do |object|
    object.quotations.joins(:cad_uploads).pluck("cad_uploads.status").include?("pending")
  end

  attribute :custom_element_count do |object|
    object.custom_elements.count
  end

  attribute :custom_element_request_date do |object|
    object.custom_elements.where(status: "pending").last.created_at.strftime("%e %b %Y %H:%M:%S%p") if object.custom_elements.where(status: "pending").present?
  end

  attribute :time_remaining do |object|
    tat = ((Time.zone.now - (object.custom_elements.where(status: "pending").last.created_at + CustomElement::TIME_TO_APPROVE))/3600).round if object.custom_elements.where(status: "pending").present?
    tat > 0 ? "#{tat.abs} hours over" : "#{tat.abs} hours left" if tat.present?
  end

  attribute :new do |object|
    object.custom_elements.where(seen_by_category: false).present? ? true : false
  end

end
