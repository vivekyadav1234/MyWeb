# == Schema Information
#
# Table name: business_units
#
#  id         :integer          not null, primary key
#  unit_name  :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class BusinessUnitSerializer < ActiveModel::Serializer
  attributes :id, :unit_name, :created_at, :updated_at
end
