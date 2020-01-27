# == Schema Information
#
# Table name: task_escalations
#
#  id             :integer          not null, primary key
#  task_set_id    :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  task_owner     :integer
#  start_time     :datetime
#  end_time       :datetime
#  completed_at   :datetime
#  remark         :text
#  status         :string           default("no")
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  is_new         :boolean          default(TRUE)
#  seen           :boolean          default(FALSE)
#

FactoryGirl.define do
  factory :task_escalation do
    task_set nil
    ownerable nil
    end_date "2018-08-07 12:05:38"
    completed_at "2018-08-07 12:05:38"
    remark "MyText"
    status "MyString"
  end
end
