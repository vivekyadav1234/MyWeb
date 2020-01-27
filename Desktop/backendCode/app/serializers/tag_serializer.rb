# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tag_type   :string
#

class TagSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :tag_type

  attribute :humanized_name
  attribute :itemName

  def itemName
    object.name
  end

  def humanized_name
    object.name.humanize
  end
end

class TagWithProductCountSerializer < TagSerializer
  attribute :product_count

  def product_count
    if object.tag_type == 'non_panel_ranges'
      object.products_in_range.count
    elsif object.tag_type == 'loose_spaces'
      object.products_in_space.count
    end  
  end
end
