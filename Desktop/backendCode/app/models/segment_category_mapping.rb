# == Schema Information
#
# Table name: segment_category_mappings
#
#  id                  :integer          not null, primary key
#  catalog_segment_id  :integer
#  catalog_category_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class SegmentCategoryMapping < ApplicationRecord
  belongs_to :catalog_segment, required: true
  belongs_to :catalog_category, required: true

  validates_uniqueness_of :catalog_category_id, scope: [:catalog_segment_id]
end
