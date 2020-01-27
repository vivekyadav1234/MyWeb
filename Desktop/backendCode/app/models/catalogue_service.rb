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

class CatalogueService < ApplicationRecord
  has_paper_trail
  #associations
  belongs_to :section
  has_many :price_specifications
  validates_presence_of :unique_sku
  validates_uniqueness_of :unique_sku

  #validations
  # validates_presence_of :name

  # validates_uniqueness_of :image_name, scope: [:section_id], allow_blank: true

  has_attached_file :attachment_file, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :attachment_file, content_type: /\Aimage\/.*\z/
end
