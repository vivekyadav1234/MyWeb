# == Schema Information
#
# Table name: sections
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  description                  :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  parent_id                    :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

class Section < ApplicationRecord

  #associations
  has_many :product_configurations, dependent: :destroy
  has_many :products, dependent: :destroy
  has_many :catalogue_services, dependent: :destroy
  has_many :modular_products, dependent: :destroy
  has_many :boqjobs
  has_many :modular_jobs

  has_many :section_tags, dependent: :destroy
  has_many :tags, through: :section_tags

  #validations
  validates_presence_of :name

  acts_as_tree  #closure_tree gem functionality

  accepts_nested_attributes_for :products, allow_destroy: true

  has_attached_file :attachment_file, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :attachment_file, content_type: /\Aimage\/.*\z/

  after_save :ensure_configuration_present

  def Section.modular_kitchen
    Section.find_by_name "Modular Kitchen"
  end

  def Section.modular_wardrobe
    Section.find_by_name "Modular Wardrobe"
  end

  def Section.loose_furniture
    Section.find_by_name "Loose Furnitures"
  end

  # Ensure that at least one configuration is present for each section
  def ensure_configuration_present
    if product_configurations.blank? && parent.present?
      self.product_configurations.create!(name: 'Standard', description: 
        'This is the standard configuration for this category.', code: '0')
    end
  end

  # send hash of id, name and number_of_products of top-level sections e.g. Loose Furniture.
  # NOTE: NOT for sub-sections (also called categories)
  def section_product_hash
    hash = Hash.new
    hash[:id] = id
    hash[:name] = name

    child_section_ids = children.pluck(:id)
    number_of_products = Product.where(section_id: child_section_ids).count
    # number_of_services = CatalogueService.where(section_id: child_section_ids).count
    hash[:count] = number_of_products

    hash
  end

  # MARKED FOR DELETION
  # Get all the space tags associated with all the products in a category and tag them 
  # against the category
  # def tag_with_spaces
  #   tags_to_select = Tag.loose_spaces.joins(:products_in_space).where(products: {id: products.pluck(:id)}).distinct
  #   tags_to_select.each do |tag|
  #     tags << tag unless tags.include?(tag)
  #   end
  # end

  # Sample category_array: [{section_id: 3, quantity: 2}, {section_id: 10, quantity: 1}]
  def Section.category_price_array(category_array)
    array_to_return = []
    category_array.each do |hash|
      section = Section.find hash[:section_id]
      # dont't include hidden products
      products_to_consider = section.products.not_hidden.where.not(sale_price: nil)
      next if products_to_consider.blank?
      sale_price_array = products_to_consider.pluck(:sale_price)
      minimum_price = sale_price_array.min
      average_price = (sale_price_array.sum)/(sale_price_array.count)
      array_to_return.push(
          {
            section_id: hash[:section_id], 
            quantity: hash[:quantity], 
            minimum_price: minimum_price, 
            average_price: average_price
          }
        )
    end

    array_to_return
  end
end
