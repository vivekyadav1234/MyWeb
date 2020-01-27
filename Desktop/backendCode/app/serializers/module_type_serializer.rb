# == Schema Information
#
# Table name: module_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ModuleTypeSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at, :category

  attribute :custom_shelf_unit

  def custom_shelf_unit
    ModuleType.custom_shelf_unit&.name == object.name
  end
end
