class FjaCsagentDashboardSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :name, :email, :contact, :roles, :nickname, :avatar, :is_active,
    :pincode, :gst_number, :pan, :address_proof, :kyc_approved,
    :created_at, :dummyemail, :last_request_at, :designer_status

  def serializable_hash
    data = super
    data[:data][:attributes]
  end

  attribute :online_status do |object|
    object.online_status ? "online" : "offline"
  end

  attribute :all_leads_assigned do |object|
    object.all_assigned_active_leads.count
  end

  attribute :leads_claimed do |object|
    object.claimed_leads.count
  end

  attribute :active_claimed_leads do |object|
    object.active_claimed_leads.count
  end

  attribute :leads_qualified do |object|
    object.qualified_active_leads.count
  end
  
  # attribute :active_leads do |object|
  #   leads = nil
  #   if object.online_status
  #     leads = object.csagent_visible_leads
  #   else
  #     leads = Lead.none
  #   end
    
  #   ActiveModelSerializers::SerializableResource.new(leads, each_serializer: LeadSerializer, except: [:agent]).serializable_hash
  # end

end