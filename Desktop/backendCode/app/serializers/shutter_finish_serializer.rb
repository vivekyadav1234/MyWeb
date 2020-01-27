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

class ShutterFinishSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :wardrobe_price, :arrivae_select
end
