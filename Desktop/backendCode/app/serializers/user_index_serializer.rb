class UserIndexSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :contact, :nickname, :avatar, :is_active, 
    :pincode, :gst_number, :pan, :address_proof, :kyc_approved, 
    :created_at, :dummyemail, :roles

  # attributes :roles, :assigned_cm

  def roles
    object.roles.pluck(:name)
  end

  # def assigned_cm
  # 	object.cm_for_site_supervisor if object.cm_for_site_supervisor.present?
  # end
end
