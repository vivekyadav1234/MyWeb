# == Schema Information
#
# Table name: product_classes
#
#  id               :integer          not null, primary key
#  product_id       :integer
#  catalog_class_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class ProductClass < ApplicationRecord
  belongs_to :product, required: true
  belongs_to :catalog_class, required: true

  validates_uniqueness_of :product_id, scope: [:catalog_class_id]
end
