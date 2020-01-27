# == Schema Information
#
# Table name: catalog_categories
#
#  id            :integer          not null, primary key
#  category_name :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

# Do NOT make this serializer heavy. Let it contain just attributes. Anything more should be 
# put in a new serializer.
class CatalogCategorySerializer < ActiveModel::Serializer
  attributes :id, :category_name, :created_at, :updated_at
end
