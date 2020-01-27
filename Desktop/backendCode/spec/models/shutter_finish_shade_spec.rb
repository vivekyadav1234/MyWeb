# == Schema Information
#
# Table name: shutter_finish_shades
#
#  id                :integer          not null, primary key
#  shutter_finish_id :integer
#  shade_id          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

require 'rails_helper'

RSpec.describe ShutterFinishShade, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
