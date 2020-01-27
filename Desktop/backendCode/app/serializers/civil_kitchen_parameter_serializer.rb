# == Schema Information
#
# Table name: civil_kitchen_parameters
#
#  id                   :integer          not null, primary key
#  depth                :integer
#  drawer_height_1      :integer
#  drawer_height_2      :integer
#  drawer_height_3      :integer
#  boq_global_config_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class CivilKitchenParameterSerializer < ActiveModel::Serializer
  attributes :id, :depth, :drawer_height_1, :drawer_height_2, :drawer_height_3, :created_at, 
    :updated_at
end
