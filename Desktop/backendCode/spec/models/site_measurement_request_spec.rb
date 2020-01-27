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

require 'rails_helper'

RSpec.describe SiteMeasurementRequest, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
