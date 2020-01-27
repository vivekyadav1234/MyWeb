# == Schema Information
#
# Table name: job_histories
#
#  id         :integer          not null, primary key
#  job_type   :string
#  job_name   :string
#  run_at     :datetime
#  info       :text
#  job_id     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :job_history do
    type ""
    job_name "MyString"
    run_at "2019-02-08 10:03:11"
    info "MyText"
    job_id 1
  end
end
