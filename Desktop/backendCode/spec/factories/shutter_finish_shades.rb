# == Schema Information
#
# Table name: shutter_finish_shades
#
#  id                :integer          not null, primary key
#  shutter_finish_id :integer
#  shade_id          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

FactoryGirl.define do
  factory :shutter_finish_shade do
    
  end
end
