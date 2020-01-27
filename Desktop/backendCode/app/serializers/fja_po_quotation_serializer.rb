class FjaPoQuotationSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :name, :created_at, :reference_number

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :project_details do |object|
    object.project
  end

  attribute :lead_name do |object|
    object.project.lead.name
  end
end