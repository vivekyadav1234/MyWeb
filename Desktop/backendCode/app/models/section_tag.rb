# == Schema Information
#
# Table name: section_tags
#
#  id         :integer          not null, primary key
#  section_id :integer
#  tag_id     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SectionTag < ApplicationRecord
  belongs_to :section, required: true
  belongs_to :tag, required: true

  validates_uniqueness_of :tag_id, scope: [:section_id]
  validate :loose_furniture_only
  validate :loose_spaces_tag_only

  private
  def loose_furniture_only
    errors.add(:section_id, "Category must belong to section Loose Furniture") unless section&.parent == Section.loose_furniture
  end

  def loose_spaces_tag_only
    errors.add(:tag_id, "Tag must be applicable to loose furniture categories.") unless tag.tag_type == "loose_spaces"
  end
end
