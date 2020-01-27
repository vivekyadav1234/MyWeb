# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  user_id          :integer
#  commentable_type :string
#  commentable_id   :integer
#  comment_for      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  body             :string
#

FactoryGirl.define do
  factory :comment do
    user nil
    commentable nil
    comment_for 1
  end
end
