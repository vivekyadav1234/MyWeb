# == Schema Information
#
# Table name: catalog_subcategories
#
#  id               :integer          not null, primary key
#  subcategory_name :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

# Do NOT make this serializer heavy. Let it contain just attributes. Anything more should be 
# put in a new serializer.
class CatalogSubcategorySerializer < ActiveModel::Serializer
  attributes :id, :subcategory_name, :created_at, :updated_at
end
