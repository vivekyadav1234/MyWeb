# == Schema Information
#
# Table name: category_subcategory_mappings
#
#  id                     :integer          not null, primary key
#  catalog_category_id    :integer
#  catalog_subcategory_id :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class CategorySubcategoryMapping < ApplicationRecord
  belongs_to :catalog_category, required: true
  belongs_to :catalog_subcategory, required: true

  validates_uniqueness_of :catalog_subcategory_id, scope: [:catalog_category_id]
end
