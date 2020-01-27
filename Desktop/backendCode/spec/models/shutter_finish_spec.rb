# == Schema Information
#
# Table name: shutter_finishes
#
#  id               :integer          not null, primary key
#  name             :string
#  price            :float
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  wardrobe_price   :float
#  lead_time        :integer          default(0)
#  hidden           :boolean          default(TRUE)
#  arrivae_select   :boolean          default(FALSE), not null
#  modspace_visible :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe ShutterFinish, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
