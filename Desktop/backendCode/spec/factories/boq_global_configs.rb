# == Schema Information
#
# Table name: boq_global_configs
#
#  id                      :integer          not null, primary key
#  core_material           :string
#  shutter_material        :string
#  shutter_finish          :string
#  shutter_shade_code      :string
#  skirting_config_type    :string
#  skirting_config_height  :string
#  door_handle_code        :string
#  shutter_handle_code     :string
#  hinge_type              :string
#  channel_type            :string
#  brand_id                :integer
#  skirting_config_id      :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  quotation_id            :integer
#  category                :string
#  edge_banding_shade_code :string
#  countertop              :string           default("none")
#  civil_kitchen           :boolean          default(FALSE)
#  countertop_width        :integer
#  is_preset               :boolean          default(FALSE)
#  preset_remark           :string
#  preset_created_by_id    :integer
#  preset_name             :string
#

FactoryGirl.define do
  factory :boq_global_config do
    
  end
end
