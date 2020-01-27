# == Schema Information
#
# Table name: production_drawings
#
#  id                  :integer          not null, primary key
#  project_handover_id :integer
#  line_item_type      :string
#  line_item_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

require 'rails_helper'

RSpec.describe ProductionDrawing, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
