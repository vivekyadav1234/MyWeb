# == Schema Information
#
# Table name: catalog_categories
#
#  id            :integer          not null, primary key
#  category_name :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class CatalogCategory < ApplicationRecord
  paginates_per 4

  has_many :segment_category_mappings, dependent: :destroy
  has_many :catalog_segments, through: :segment_category_mappings

  has_many :category_subcategory_mappings, dependent: :destroy
  has_many :catalog_subcategories, through: :category_subcategory_mappings

  has_many :product_categories, dependent: :destroy
  has_many :products, through: :product_categories

  validates_presence_of :category_name
  validates_uniqueness_of :category_name, case_sensitive: false

  scope :of_catalog_type, -> (catalog_type) { joins(:products).where(products: { catalog_type: catalog_type }).distinct if catalog_type.present? }

  # Map a segment against this.
  def add_segment(catalog_segment)
    self.catalog_segments << catalog_segment
  end

  # Remove a mapped segment.
  def remove_segment(catalog_segment)
    self.catalog_segments.delete(catalog_segment.id)
  end

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

  def breadcrumb
    segment = catalog_segments.first
    if segment.present?
      {
        segment: {
          id: segment.id, 
          name: segment.segment_name
        }, 
        category: {
          id: id, 
          name: category_name
        }
      }
    else
      {}
    end
  end
end
