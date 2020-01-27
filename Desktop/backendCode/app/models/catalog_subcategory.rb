# == Schema Information
#
# Table name: catalog_subcategories
#
#  id               :integer          not null, primary key
#  subcategory_name :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class CatalogSubcategory < ApplicationRecord
  paginates_per 4

  has_many :category_subcategory_mappings, dependent: :destroy
  has_many :catalog_categories, through: :category_subcategory_mappings

  has_many :subcategory_class_mappings, dependent: :destroy
  has_many :catalog_classes, through: :subcategory_class_mappings

  has_many :product_subcategories, dependent: :destroy
  has_many :products, through: :product_subcategories

  validates_presence_of :subcategory_name
  validates_uniqueness_of :subcategory_name, case_sensitive: false

  scope :of_catalog_type, -> (catalog_type) { joins(:products).where(products: { catalog_type: catalog_type }).distinct if catalog_type.present? }

  # Map a category against this.
  def add_category(catalog_category)
    self.catalog_categories << catalog_category
  end

  # Remove a mapped category.
  def remove_category(catalog_category)
    self.catalog_categories.delete(catalog_category.id)
  end

  # Map a class against this.
  def add_catalog_class(catalog_class)
    self.catalog_classs << catalog_class
  end

  # Remove a mapped class.
  def remove_catalog_class(catalog_class)
    self.catalog_classses.delete(catalog_class.id)
  end

  # Map a product against this.
  def add_product(product)
    self.products << product
  end

  # Remove a mapped product.
  def remove_product(product)
    self.products.delete(product.id)
  end

  def breadcrumb
    category = catalog_categories.first
    segment = category&.catalog_segments&.first
    if segment.present? && category.present?
      {
        segment: {
          id: segment.id, 
          name: segment.segment_name
        }, 
        category: {
          id: category.id, 
          name: category.category_name
        }, 
        subcategory: {
          id: id, 
          name: subcategory_name
        }
      }
    else
      {}
    end
  end
end
