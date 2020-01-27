# == Schema Information
#
# Table name: kitchen_module_addon_mappings
#
#  id                    :integer          not null, primary key
#  kitchen_addon_slot_id :integer
#  addon_id              :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  addon_combination_id  :integer
#

FactoryGirl.define do
  factory :kitchen_module_addon_mapping do
    
  end
end
