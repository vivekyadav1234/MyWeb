# == Schema Information
#
# Table name: module_hardware_elements
#
#  id                  :integer          not null, primary key
#  product_module_id   :integer
#  hardware_element_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  quantity            :integer
#

class ModuleHardwareElement < ApplicationRecord
  has_paper_trail

  belongs_to :product_module, required: true
  belongs_to :hardware_element, required: true

  validates_uniqueness_of :hardware_element_id, scope: [:product_module_id]
  validate :both_same_category

  private
  def both_same_category
    errors.add(:hardware_element, "must belong to same category as module") unless product_module.category == hardware_element.category
  end
end
