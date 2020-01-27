# == Schema Information
#
# Table name: shutter_material_finishes
#
#  id                :integer          not null, primary key
#  core_material_id  :integer
#  shutter_finish_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  mapping_type      :string           default("arrivae"), not null
#

FactoryGirl.define do
  factory :shutter_material_finish do
    
  end
end
