# == Schema Information
#
# Table name: catalog_segments
#
#  id           :integer          not null, primary key
#  segment_name :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  marketplace  :boolean          default(FALSE)
#

# This serializer is for the basic details of a subcategory - shown when a category is clicked.
# This MUST be kept lightweight.
class CatalogSegmentSerializer < ActiveModel::Serializer
  attributes :id, :segment_name, :created_at, :updated_at
end
