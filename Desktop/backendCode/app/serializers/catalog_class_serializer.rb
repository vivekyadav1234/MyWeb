# == Schema Information
#
# Table name: catalog_classes
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CatalogClassSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at
end
