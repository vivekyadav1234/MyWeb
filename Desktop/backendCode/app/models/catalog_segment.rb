# == Schema Information
#
# Table name: catalog_segments
#
#  id           :integer          not null, primary key
#  segment_name :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  marketplace  :boolean          default(FALSE)
#

class CatalogSegment < ApplicationRecord
  has_many :unit_segment_mappings, dependent: :destroy
  has_many :business_units, through: :unit_segment_mappings

  has_many :segment_category_mappings, dependent: :destroy
  has_many :catalog_categories, through: :segment_category_mappings

  has_many :product_segments, dependent: :destroy
  has_many :products, through: :product_segments

  validates_presence_of :segment_name
  validates_uniqueness_of :segment_name, case_sensitive: false

  scope :marketplace, -> { where(marketplace: true) }
  scope :of_catalog_type, -> (catalog_type) { joins(:products).where(products: { catalog_type: catalog_type }).distinct if catalog_type.present? }

  # Map a business_unit against this.
  def add_business_unit(business_unit)
    self.business_units << business_unit
  end

  # Remove a mapped business_unit.
  def remove_business_unit(business_unit)
    self.business_units.delete(business_unit.id)
  end

  # Map a category against this.
  def add_category(catalog_category)
    self.catalog_categories << catalog_category
  end

  # Remove a mapped category.
  def remove_category(catalog_category)
    self.catalog_categories.delete(catalog_category.id)
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
    {
      segment: {
        id: id, 
        name: segment_name
      }
    }
  end
end
