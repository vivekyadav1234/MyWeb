# == Schema Information
#
# Table name: sections
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  description                  :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  parent_id                    :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

class SectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :created_at, :updated_at, :parent_id, :attachment_file
end

class SectionWithProductCountSerializer < SectionSerializer
  attribute :product_count
  attribute :space_ids

  def product_count
    if instance_options[:space_ids].present?
      object.products.joins(:space_tags).where(tags: { id: instance_options[:space_ids] }).distinct.count
    else
      object.products.count
    end
  end

  def space_ids
    object.tags.pluck(:id)
  end
end

class SectionWithDetailsSerializer < SectionSerializer
  attribute :parent
  attribute :children
  attribute :product_list
  attribute :product_configurations

  def parent
    object.parent
  end

  def children
    object.children.map{ |sub_section|
      SubSectionSerializer.new(sub_section).serializable_hash
    }
  end

  def product_list
    object.products
  end

  def product_configurations
    object.product_configurations.map{ |config|
      config.attributes.slice("id", "name")
    }
  end
end
