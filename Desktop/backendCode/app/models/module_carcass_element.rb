# == Schema Information
#
# Table name: module_carcass_elements
#
#  id                 :integer          not null, primary key
#  product_module_id  :integer
#  carcass_element_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  quantity           :integer
#

class ModuleCarcassElement < ApplicationRecord
  has_paper_trail

  belongs_to :product_module, required: true
  belongs_to :carcass_element, required: true

  validates_uniqueness_of :carcass_element_id, scope: [:product_module_id]
  validate :both_same_category

  private
  def both_same_category
    errors.add(:carcass_element_id, "must belong to same category as module") unless product_module.category == carcass_element.category
  end
end
