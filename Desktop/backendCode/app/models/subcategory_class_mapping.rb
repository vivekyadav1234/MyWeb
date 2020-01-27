# == Schema Information
#
# Table name: subcategory_class_mappings
#
#  id                     :integer          not null, primary key
#  catalog_subcategory_id :integer
#  catalog_class_id       :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class SubcategoryClassMapping < ApplicationRecord
  belongs_to :catalog_subcategory, required: true
  belongs_to :catalog_class, required: true

  validates_uniqueness_of :catalog_class_id, scope: [:catalog_subcategory_id]
end
