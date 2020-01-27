# == Schema Information
#
# Table name: hardware_elements
#
#  id                       :integer          not null, primary key
#  code                     :string
#  category                 :string
#  unit                     :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  hardware_type_id         :integer
#  hardware_element_type_id :integer
#

class HardwareElement < ApplicationRecord
  has_paper_trail

  belongs_to :brand, optional: true
  belongs_to :hardware_type
  belongs_to :hardware_element_type

  has_many :module_hardware_elements, dependent: :destroy
  has_many :product_modules, through: :module_hardware_elements

  validates_presence_of :code
  validates_uniqueness_of :code, scope: [:brand_id, :category]
  validates_presence_of :hardware_type_id
  validates_presence_of :hardware_element_type_id

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}

  # price is actually mrp in the excel.
  def get_price(category)
    hardware_element = HardwareElement.where(category: category, code: code).last&.price.to_f
  end
end
