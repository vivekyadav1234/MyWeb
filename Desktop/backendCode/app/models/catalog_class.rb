# == Schema Information
#
# Table name: catalog_classes
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CatalogClass < ApplicationRecord
  has_many :subcategory_class_mappings, dependent: :destroy
  has_many :catalog_subcategories, through: :subcategory_class_mappings

  has_many :product_classes, dependent: :destroy
  has_many :products, through: :product_classes

  # :class_name is already a method, so we have used :name as it is safer.
  validates_presence_of :name
  validates_uniqueness_of :name, case_sensitive: false

  scope :of_catalog_type, -> (catalog_type) { joins(:products).where(products: { catalog_type: catalog_type }).distinct if catalog_type.present? }

  # Map a subcategory against this.
  def add_subcategory(catalog_subcategory)
    self.catalog_subcategories << catalog_subcategory
  end

  # Remove a mapped subcategory.
  def remove_subcategory(catalog_subcategory)
    self.catalog_subcategories.delete(catalog_subcategory.id)
  end

  # Map a product against this.
  def add_product(product)
    self.products << product
  end

  # Remove a mapped product.
  def remove_product(product)
    self.products.delete(product.id)
  end
end
