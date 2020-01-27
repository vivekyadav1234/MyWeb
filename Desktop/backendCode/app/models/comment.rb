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

class Comment < ApplicationRecord
  #associations
  belongs_to :user
  belongs_to :commentable, polymorphic: true
end
