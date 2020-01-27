class FjaUserDetailsSerializer 
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :name, :email, :contact, :nickname, :avatar, :is_active,
    :pincode, :gst_number, :pan, :address_proof, :kyc_approved,
    :created_at, :dummyemail, :last_request_at, :extension, :user_level, :is_champion, :is_cm_enable

  def serializable_hash
    data = super
    data[:data][:attributes]
  end

  attribute :roles do |object|
    object.roles.pluck(:name)
  end

  attribute :online_status do |object|
    object.online_status ? "online" : "offline"
  end

  attribute :exophone do |object|
    User::COMMON_EXOPHONE
  end
end

