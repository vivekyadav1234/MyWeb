# == Schema Information
#
# Table name: product_module_types
#
#  id                :integer          not null, primary key
#  product_module_id :integer
#  module_type_id    :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class ProductModuleType < ApplicationRecord
  has_paper_trail

  belongs_to :product_module, required: true
  belongs_to :module_type, required: true

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES
end
