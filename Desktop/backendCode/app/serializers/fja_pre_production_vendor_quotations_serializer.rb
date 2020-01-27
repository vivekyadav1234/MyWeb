class FjaPreProductionVendorQuotationsSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :created_at, :reference_number

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :subline_items do |object|
  	object.job_elements.where(ownerable_type: "Boqjob")
  end

  attributes :other_items do |object|
    object.job_elements.where(ownerable_type: nil)
  end
end