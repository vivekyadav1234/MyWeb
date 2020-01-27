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

require 'rails_helper'

RSpec.describe ProjectBookingForm, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
