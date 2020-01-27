# == Schema Information
#
# Table name: unit_product_mappings
#
#  id               :integer          not null, primary key
#  business_unit_id :integer
#  product_id       :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class UnitProductMapping < ApplicationRecord
  belongs_to :business_unit, required: true
  belongs_to :product, required: true

  validates_uniqueness_of :product_id, scope: [:business_unit_id]
end
