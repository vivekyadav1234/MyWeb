# == Schema Information
#
# Table name: alternate_contacts
#
#  id             :integer          not null, primary key
#  name           :string
#  contact        :string
#  relation       :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class AlternateContactSerializer < ActiveModel::Serializer
  attributes :contacts, :id, :user_id

  def contacts
    lead_hash = Hash.new
    lead_hash[:contact] = object.contact
    lead_hash[:name] = object.name
    lead_hash[:relation] = "Customer"
    all_contacts = []
    object.alternate_contacts.each do |ac|
      contact = Hash.new
      contact[:name] = ac.name
      contact[:contact] = ac.contact
      contact[:relation] = ac.relation
      all_contacts.push contact
    end
    all_contacts.push lead_hash

  end

  def user_id
    object.related_user&.id
  end
end
