# == Schema Information
#
# Table name: project_booking_forms
#
#  id                         :integer          not null, primary key
#  date                       :datetime
#  lead_id                    :integer
#  project_id                 :integer
#  flat_no                    :string
#  floor_no                   :string
#  building_name              :text
#  location                   :text
#  city                       :string
#  pincode                    :string
#  possession_by              :string
#  profession                 :string
#  designation                :string
#  company                    :string
#  professional_details       :string
#  annual_income              :string
#  landline                   :string
#  primary_mobile             :string
#  secondary_mobile           :string
#  primary_email              :string
#  secondary_email            :string
#  current_address            :text
#  order_value                :string
#  order_date                 :date
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  other_professional_details :string
#  billing_address            :text
#  gst_number                 :string
#  billing_name               :string
#  address_type               :text
#

FactoryGirl.define do
  factory :project_booking_form do
    date "2018-05-05 23:04:40"
    lead nil
    project nil
    flat_no "MyString"
    floor_no "MyString"
    building_name "MyText"
    location "MyText"
    city "MyString"
    pincode "MyString"
    possession_by "MyString"
    profession "MyString"
    designation "MyString"
    company "MyString"
    professional_details "MyString"
    annual_income "MyString"
    landline "MyString"
    primary_mobile "MyString"
    secondary_mobile "MyString"
    primary_email "MyString"
    secondary_email "MyString"
    current_address "MyText"
    order_value "MyString"
    order_date "2018-05-05"
  end
end
