# == Schema Information
#
# Table name: core_material_prices
#
#  id               :integer          not null, primary key
#  thickness        :float
#  price            :float
#  core_material_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  category         :string           default("kitchen")
#

require 'rails_helper'

RSpec.describe CoreMaterialPrice, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
