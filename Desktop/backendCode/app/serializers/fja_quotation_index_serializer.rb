class FjaQuotationIndexSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :name, :net_amount, :total_amount, :status, :remark,
    :expiration_date, :updated_at, :reference_number,
    :modular, :parent_quotation_id, :parent_quotation_reference_no
  
  def serializable_hash
    data = super
    data[:data]
  end
  
  # using parent quotation discount value if child quotation discount status is no_discount    
  attribute :discount_value do |object|
    object.discount_status == "no_discount" && object.parent_quotation.present? ? object.parent_quotation.discount_value : object.discount_value
  end

  attribute :modular do |object|
    object.modular_jobs.present?
  end

 
  attribute :stage do |object|
    object.final_boq? ? 'Final' : 'Initial'
  end

  attribute :pm_fee do |object|
    object.total_pm_fee.round(2)
  end
  attribute :parent_quotation_reference_no do |object|
    object.parent_quotation&.reference_number
  end
end