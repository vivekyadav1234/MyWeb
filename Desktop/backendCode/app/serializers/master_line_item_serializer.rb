# == Schema Information
#
# Table name: master_line_items
#
#  id         :integer          not null, primary key
#  mli_name   :string           not null
#  mli_type   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class MasterLineItemSerializer < ActiveModel::Serializer
  attributes :id, :mli_name, :mli_type, :created_at, :updated_at

  attribute :dynamic_attributes

  def dynamic_attributes
    object.mli_attributes.map do |mli_attribute|
      MliAttributeWithOptionsSerializer.new(mli_attribute).serializable_hash
    end
  end
end
