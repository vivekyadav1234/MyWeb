# == Schema Information
#
# Table name: project_details
#
#  id                           :integer          not null, primary key
#  customer_name                :string
#  mobile_number                :string
#  alternate_mobile             :string
#  email                        :string
#  city                         :string
#  property_usage               :string
#  property_age                 :string
#  property_type                :string
#  number_of_rooms              :string
#  project_name                 :string
#  project_address              :string
#  flat_no                      :string
#  area_of_flat                 :integer
#  possession_status            :string
#  possession_date              :date
#  use_type                     :string
#  requirement                  :string
#  budget                       :integer
#  floor_plan_link              :string
#  preferred_time_call_designer :datetime
#  preferred_time_site_visit    :datetime
#  occupation_of_customer       :string
#  occupation_of_spouse         :string
#  members_in_family            :integer
#  tentative_date_moving        :date
#  project_type                 :string
#  scope_of_work                :text             default([]), not null, is an Array
#  kitchen                      :json             not null
#  master_bedroom               :json             not null
#  kids_bedroom                 :json             not null
#  parent_bedroom               :json             not null
#  guest_bedroom                :json             not null
#  living_room                  :json             not null
#  pooja_room                   :json             not null
#  project_id                   :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  foyer                        :json             not null
#

FactoryGirl.define do
  factory :project_detail do
    
  end
end
