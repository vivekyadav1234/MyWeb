# == Schema Information
#
# Table name: addon_combinations
#
#  id         :integer          not null, primary key
#  combo_name :string           default("default")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  code       :string
#

class AddonCombinationSerializer < ActiveModel::Serializer
  attributes :id, :combo_name, :created_at, :updated_at, :extra, :hidden

  attribute :included_addons
  attribute :included_mrp

  def included_addons
    object.addon_combination_mappings.map do |mapping|
      AddonSerializer.new(mapping.addon).serializable_hash.merge(quantity: mapping.quantity)
    end
  end

  def included_mrp
    object.mrp.round(2)
  end
end
