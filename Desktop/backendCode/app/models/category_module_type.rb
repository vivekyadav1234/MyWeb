# == Schema Information
#
# Table name: category_module_types
#
#  id                  :integer          not null, primary key
#  kitchen_category_id :integer
#  module_type_id      :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class CategoryModuleType < ApplicationRecord
  has_paper_trail

  belongs_to :kitchen_category, required: true
  belongs_to :module_type, required: true

  validates_uniqueness_of :module_type, scope: [:kitchen_category]
  validate :module_type_kitchen_only

  private
  def module_type_kitchen_only
    errors.add(:module_type_id, "must belong to kitchen category") unless module_type&.category == 'kitchen'
  end
end
