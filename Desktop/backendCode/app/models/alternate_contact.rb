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

class AlternateContact < ApplicationRecord
  belongs_to :ownerable,  polymorphic: true
  validates_presence_of :contact

  validates_uniqueness_of :contact, scope: [:ownerable_id, :ownerable_type]

  #add new alternate_contact
  def AlternateContact.add_alternate_contact(ac, ownerable_id, ownerable_type)
    #ac in the format of {"name": "", "contact": "", "relatation": ""}
    ownerable_type.constantize.find_by_id(ownerable_id).alternate_contacts.destroy_all
    ac.each do |altenate|
      if altenate[:contact].present?
        ac = AlternateContact.where(ownerable_id: ownerable_id,ownerable_type: ownerable_type, contact: altenate[:contact].strip).first_or_initialize
        ac.name =  altenate[:name].strip
        ac.relation =  altenate[:relation].strip
        ac.save!
      end
    end
  end

end
