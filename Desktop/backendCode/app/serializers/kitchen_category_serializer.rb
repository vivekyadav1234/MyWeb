# == Schema Information
#
# Table name: kitchen_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class KitchenCategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at
end
