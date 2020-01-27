# == Schema Information
#
# Table name: hardware_types
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class HardwareTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at
end
