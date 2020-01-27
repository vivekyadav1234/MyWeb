class SubSectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :created_at, :updated_at, :product_list, :attachment_file

  attribute :children
  def children
    object.children
  end

  def product_list
    object.products
  end
end
