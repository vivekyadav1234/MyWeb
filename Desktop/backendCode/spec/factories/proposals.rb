# == Schema Information
#
# Table name: proposals
#
#  id              :integer          not null, primary key
#  proposal_type   :string
#  proposal_name   :string
#  project_id      :integer
#  designer_id     :integer
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  proposal_status :string
#  is_draft        :string
#

FactoryGirl.define do
  factory :proposal do
    proposal_type "MyString"
    proposal_name "MyString"
    project nil
    designer_id 1
    sent_at "2018-03-28 16:48:09"
  end
end
