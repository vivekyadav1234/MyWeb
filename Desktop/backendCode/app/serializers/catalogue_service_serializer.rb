# == Schema Information
#
# Table name: catalogue_services
#
#  id                           :integer          not null, primary key
#  name                         :string
#  image_name                   :string
#  product_type                 :string
#  product_subtype              :string
#  unique_sku                   :string
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  section_id                   :integer
#  brand                        :string
#  catalogue_code               :string
#  specification                :text
#  rate_per_unit                :float
#  l1_rate                      :float
#  l1_quote_price               :float
#  l2_rate                      :float
#  l2_quote_price               :float
#  contractor_rate              :float
#  contractor_quote_price       :float
#  measurement_unit             :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

class CatalogueServiceSerializer < ActiveModel::Serializer
  attributes :id, :attachment_file, :name, :image_name, :product_subtype, :product_type, :unique_sku, 
  	:section_id, :brand, :catalogue_code, :specification, :rate_per_unit, :measurement_unit

  	belongs_to :section
end
