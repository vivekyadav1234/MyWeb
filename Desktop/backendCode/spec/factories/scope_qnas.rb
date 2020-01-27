# == Schema Information
#
# Table name: scope_qnas
#
#  id             :integer          not null, primary key
#  scope_space_id :integer
#  question       :text
#  arrivae_scope  :text
#  client_scope   :text
#  remark         :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :scope_qna do
    scope_space nil
    question "MyText"
    arrivae_scope "MyText"
    client_scope "MyText"
    remark "MyText"
  end
end
