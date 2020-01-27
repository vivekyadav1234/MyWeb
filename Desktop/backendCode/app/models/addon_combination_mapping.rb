# == Schema Information
#
# Table name: addon_combination_mappings
#
#  id                   :integer          not null, primary key
#  quantity             :integer          default(0), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  addon_id             :integer
#  addon_combination_id :integer
#

class AddonCombinationMapping < ApplicationRecord
  belongs_to :addon, required: true
  belongs_to :addon_combination, required: true

  validates_presence_of :quantity
  validates_uniqueness_of :addon_id, scope: [:addon_combination_id]
end
