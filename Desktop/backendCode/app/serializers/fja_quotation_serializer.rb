class FjaQuotationSerializer 
  include FastJsonapi::ObjectSerializer
  attributes :id, :reference_number

  def serializable_hash
    data = super
    data[:data]
  end
end