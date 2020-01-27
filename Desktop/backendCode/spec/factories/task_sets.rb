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

FactoryGirl.define do
  factory :task_set do
    task_name "MyString"
    duration_in_hr "MyString"
    notify_to "MyText"
    notify_by_email false
    notify_by_sms false
    optional false
    stage "MyString"
  end
end
