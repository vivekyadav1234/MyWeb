# == Schema Information
#
# Table name: core_materials
#
#  id               :integer          not null, primary key
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  lead_time        :integer          default(0)
#  hidden           :boolean          default(TRUE)
#  arrivae_select   :boolean          default(FALSE), not null
#  modspace_visible :boolean          default(FALSE), not null
#  modspace_shutter :boolean          default(FALSE), not null
#

FactoryGirl.define do
  factory :core_material do
    
  end
end
