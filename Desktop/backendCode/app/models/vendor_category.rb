# == Schema Information
#
# Table name: vendor_categories
#
#  id                 :integer          not null, primary key
#  category_name      :string
#  parent_category_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class VendorCategory < ApplicationRecord
  has_paper_trail
  has_many :vendor_category_mappings, foreign_key: 'sub_category_id', dependent: :destroy
  has_many :vendors, through: :vendor_category_mappings
  # for sub categories
  belongs_to :parent_category, class_name: 'VendorCategory', optional: true, dependent: :destroy
  has_many :sub_categories, :class_name => 'VendorCategory', :foreign_key => 'parent_category_id', dependent: :destroy
  
end
