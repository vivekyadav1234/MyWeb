# == Schema Information
#
# Table name: modular_products
#
#  id                   :integer          not null, primary key
#  name                 :string
#  modular_product_type :string
#  space                :string
#  price                :float
#  section_id           :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class ModularProduct < ApplicationRecord
  has_paper_trail

  belongs_to :section

  has_many :product_modules, dependent: :destroy

  validates_presence_of :space

  ALL_TYPES = ['kitchen', 'wardrobe']
  validates_inclusion_of :modular_product_type, in: ALL_TYPES

end
