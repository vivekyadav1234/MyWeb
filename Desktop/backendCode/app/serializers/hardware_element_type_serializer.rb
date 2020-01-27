# == Schema Information
#
# Table name: hardware_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class HardwareElementTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :category, :created_at, :updated_at
end
