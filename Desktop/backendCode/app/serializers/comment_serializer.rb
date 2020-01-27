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

class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :owner_role, :avatar

  def owner_role
    object.user.roles.first.name
  end

  def avatar
  	object.user.avatar.url
  end
end
