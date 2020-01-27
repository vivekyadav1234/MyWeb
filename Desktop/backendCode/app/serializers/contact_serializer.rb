# == Schema Information
#
# Table name: contacts
#
#  id           :integer          not null, primary key
#  phone_number :string
#  source       :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class ContactSerializer < ActiveModel::Serializer
  attributes :id, :phone_number, :source, :created_at

   def created_at
    object.created_at.strftime("%d/%m/%Y")
  end
end
