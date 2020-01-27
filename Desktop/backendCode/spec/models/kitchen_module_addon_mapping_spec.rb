# == Schema Information
#
# Table name: kitchen_module_addon_mappings
#
#  id                    :integer          not null, primary key
#  kitchen_addon_slot_id :integer
#  addon_id              :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  addon_combination_id  :integer
#

require 'rails_helper'

RSpec.describe KitchenModuleAddonMapping, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
