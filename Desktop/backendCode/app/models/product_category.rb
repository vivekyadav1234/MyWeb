# == Schema Information
#
# Table name: product_categories
#
#  id                  :integer          not null, primary key
#  product_id          :integer
#  catalog_category_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class ProductCategory < ApplicationRecord
  belongs_to :product, required: true
  belongs_to :catalog_category, required: true

  validates_uniqueness_of :product_id, scope: [:catalog_category_id]
end
