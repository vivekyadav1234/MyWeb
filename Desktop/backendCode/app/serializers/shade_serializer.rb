# == Schema Information
#
# Table name: shades
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
#  edge_banding_shade_id    :integer
#  hidden                   :boolean          default(FALSE)
#  lead_time                :integer          default(0)
#  arrivae_select           :boolean          default(FALSE), not null
#

class ShadeSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :shade_image, :created_at, :updated_at, :edge_banding_shade_id, :arrivae_select

  attribute :edge_banding_shade

  def edge_banding_shade
    ebs = object.edge_banding_shade
    if ebs.present?
    	EdgeBandingShadeSerializer.new(ebs).serializable_hash
    end
  end
end
