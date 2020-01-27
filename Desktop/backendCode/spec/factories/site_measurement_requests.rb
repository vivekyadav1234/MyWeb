# == Schema Information
#
# Table name: site_measurement_requests
#
#  id                :integer          not null, primary key
#  project_id        :integer
#  designer_id       :integer
#  sitesupervisor_id :integer
#  request_type      :string
#  address           :text
#  scheduled_at      :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  request_status    :string           default("pending")
#  rescheduled_at    :datetime
#  remark            :text
#  name              :string           default("site_measurement_output")
#

FactoryGirl.define do
  factory :site_measurement_request do
    project nil
    designer_id 1
    sitesupervisor_id 1
    request_type "MyString"
    address "MyText"
    scheduled_at "2018-04-24 16:02:01"
  end
end
