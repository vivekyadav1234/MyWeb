# == Schema Information
#
# Table name: product_subcategories
#
#  id                     :integer          not null, primary key
#  product_id             :integer
#  catalog_subcategory_id :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class ProductSubcategory < ApplicationRecord
  belongs_to :product, required: true
  belongs_to :catalog_subcategory, required: true

  validates_uniqueness_of :product_id, scope: [:catalog_subcategory_id]
end
