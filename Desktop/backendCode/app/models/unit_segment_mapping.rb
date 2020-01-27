# == Schema Information
#
# Table name: unit_segment_mappings
#
#  id                 :integer          not null, primary key
#  business_unit_id   :integer
#  catalog_segment_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class UnitSegmentMapping < ApplicationRecord
  belongs_to :business_unit, required: true
  belongs_to :catalog_segment, required: true

  validates_uniqueness_of :catalog_segment_id, scope: [:business_unit_id]
end
