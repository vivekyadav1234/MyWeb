# == Schema Information
#
# Table name: product_segments
#
#  id                 :integer          not null, primary key
#  product_id         :integer
#  catalog_segment_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class ProductSegment < ApplicationRecord
  belongs_to :product, required: true
  belongs_to :catalog_segment, required: true

  validates_uniqueness_of :product_id, scope: [:catalog_segment_id]
end
