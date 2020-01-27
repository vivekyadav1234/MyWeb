# == Schema Information
#
# Table name: product_space_tags
#
#  id         :integer          not null, primary key
#  tag_id     :integer
#  product_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ProductSpaceTag < ApplicationRecord
  belongs_to :tag, required: true
  belongs_to :product, required: true

  validates_uniqueness_of :tag_id, scope: [:product_id]
  validate :loose_spaces_tag_only

  private
  def loose_spaces_tag_only
    errors.add(:tag_id, "Tag must be applicable to loose furniture categories.") unless tag.tag_type == "loose_spaces"
  end
end
