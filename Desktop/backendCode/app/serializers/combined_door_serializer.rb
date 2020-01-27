# == Schema Information
#
# Table name: combined_doors
#
#  id         :integer          not null, primary key
#  name       :string
#  code       :string
#  price      :float
#  brand_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CombinedDoorSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :price, :created_at, :updated_at, :brand_id

  attribute :brand_name

  def brand_name
    object.brand&.name
  end  
end
