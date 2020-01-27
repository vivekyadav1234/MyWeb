# == Schema Information
#
# Table name: task_sets
#
#  id              :integer          not null, primary key
#  task_name       :string
#  duration_in_hr  :string
#  notify_to       :text             default([]), is an Array
#  notify_by_email :boolean
#  notify_by_sms   :boolean
#  optional        :boolean
#  stage           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  task_owner      :string
#

require 'rails_helper'

RSpec.describe TaskSet, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
