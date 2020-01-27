class FjaProjectSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :lead_name do |object|
  	object&.lead&.name
  end

end