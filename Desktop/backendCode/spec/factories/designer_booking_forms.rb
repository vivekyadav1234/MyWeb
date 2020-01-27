# == Schema Information
#
# Table name: designer_booking_forms
#
#  id                             :integer          not null, primary key
#  customer_name                  :string
#  customer_age                   :integer
#  profession                     :string
#  family_profession              :string
#  age_house                      :string
#  lifestyle                      :text
#  house_positive_features        :text
#  house_negative_features        :text
#  inspiration                    :string
#  inspiration_image_file_name    :string
#  inspiration_image_content_type :string
#  inspiration_image_file_size    :integer
#  inspiration_image_updated_at   :datetime
#  color_tones                    :string
#  theme                          :string
#  functionality                  :string
#  false_ceiling                  :string
#  electrical_points              :string
#  special_needs                  :string
#  vastu_shastra                  :text
#  all_at_once                    :string
#  budget_range                   :float
#  design_style_tastes            :string
#  storage_space                  :string
#  mood                           :string
#  enhancements                   :string
#  discuss_in_person              :string
#  mk_age                         :integer
#  mk_gut_kitchen                 :string
#  mk_same_layout                 :string
#  mk_improvements                :text
#  mk_special_requirements        :string
#  mk_cooking_details             :text
#  mk_appliances                  :string
#  mk_family_eating_area          :string
#  mk_guest_frequence             :string
#  mk_storage_patterns            :string
#  mk_cabinet_finishing           :string
#  mk_countertop_materials        :string
#  mk_mood                        :string
#  project_id                     :integer
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#

FactoryGirl.define do
  factory :designer_booking_form do
    
  end
end
