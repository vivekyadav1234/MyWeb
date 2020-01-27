# == Schema Information
#
# Table name: product_likes
#
#  id         :integer          not null, primary key
#  product_id :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ProductLike < ApplicationRecord
  belongs_to :product, required: true
  belongs_to :user, required: true

  validates_uniqueness_of :product_id, scope: [:user_id]
end
