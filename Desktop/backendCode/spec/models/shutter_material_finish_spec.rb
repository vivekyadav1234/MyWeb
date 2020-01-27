# == Schema Information
#
# Table name: shutter_material_finishes
#
#  id                :integer          not null, primary key
#  core_material_id  :integer
#  shutter_finish_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  mapping_type      :string           default("arrivae"), not null
#

require 'rails_helper'

RSpec.describe ShutterMaterialFinish, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
