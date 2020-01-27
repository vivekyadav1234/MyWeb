# == Schema Information
#
# Table name: business_units
#
#  id         :integer          not null, primary key
#  unit_name  :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class BusinessUnit < ApplicationRecord
  has_many :products

  has_many :unit_segment_mappings, dependent: :destroy
  has_many :catalog_segments, through: :unit_segment_mappings

  has_many :unit_product_mappings, dependent: :destroy
  has_many :products, through: :unit_product_mappings

  validates_presence_of :unit_name
  validates_uniqueness_of :unit_name

  scope :of_catalog_type, -> (catalog_type) { joins(:products).where(products: { catalog_type: catalog_type }).distinct if catalog_type.present? }

  # Map a segment against this.
  def add_segment(catalog_segment)
    self.catalog_segments << catalog_segment
  end

  # Remove a mapped segment.
  def remove_segment(catalog_segment)
    self.catalog_segments.delete(catalog_segment.id)
  end

  # Map a product against this.
  def add_product(product)
    self.products << product
  end

  # Remove a mapped product.
  def remove_product(product)
    self.products.delete(product.id)
  end

  # only alphabets, digits, '-', '+', ';', ':' are allowed in name.
  def self.format_name(str)
    str.to_s.squish.gsub('/[^a-z0-9:-+();]/', '')
  end
end
