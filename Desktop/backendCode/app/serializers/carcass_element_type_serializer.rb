# == Schema Information
#
# Table name: carcass_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  aluminium  :boolean          default(FALSE)
#  glass      :boolean          default(FALSE)
#

class CarcassElementTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :category, :created_at, :updated_at, :aluminium, :glass
end
