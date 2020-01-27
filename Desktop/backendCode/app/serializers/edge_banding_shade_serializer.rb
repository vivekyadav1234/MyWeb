# == Schema Information
#
# Table name: edge_banding_shades
#
#  id                       :integer          not null, primary key
#  name                     :string
#  code                     :string
#  shade_image_file_name    :string
#  shade_image_content_type :string
#  shade_image_file_size    :integer
#  shade_image_updated_at   :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class EdgeBandingShadeSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :shade_image, :created_at, :updated_at
end
