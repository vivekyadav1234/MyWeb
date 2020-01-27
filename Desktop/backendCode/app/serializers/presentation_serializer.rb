# == Schema Information
#
# Table name: presentations
#
#  id               :integer          not null, primary key
#  title            :string           not null
#  ppt_file_name    :string
#  ppt_content_type :string
#  ppt_file_size    :integer
#  ppt_updated_at   :datetime
#  project_id       :integer
#  designer_id      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class PresentationSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  attributes :id, :title, :created_at, :updated_at, :lead_id

  # belongs_to :project
  # belongs_to :designer

  attribute :slides
  attribute :products

  def lead_id
    object.project.lead.id
  end

  def slides
    object.slides.order('created_at ASC')
  end

  def created_at
    object.created_at.strftime("%e %B %Y")
  end

  def updated_at
    time_ago_in_words(object.updated_at) + " ago"
  end

  def products
    arr = []
    products = object&.presentations_products
    products.each do |product|
      hash = product&.slice(:id,:quantity, :space, :product_id)
      hash[:product_photo] = Product.find(product.product_id).product_image
      arr.push(hash)
    end
    arr
  end

end

class PptProductsSerializer < ActiveModel::Serializer
  attributes :id,:quantity, :space, :product_id, :product_photo, :product_name
  
  def product_photo
    object.product&.product_image
  end

  def product_name
    object.product&.name
  end
end
