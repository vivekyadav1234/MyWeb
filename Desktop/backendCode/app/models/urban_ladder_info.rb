# == Schema Information
#
# Table name: urban_ladder_infos
#
#  id               :integer          not null, primary key
#  product_id       :integer
#  master_sku       :string           not null
#  product_template :string           not null
#  url              :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  price            :float
#  ul_product_id    :integer
#

class UrbanLadderInfo < ApplicationRecord
  belongs_to :product, required: true

  validates_presence_of :product_id
  validates_presence_of :master_sku
  validates_presence_of :product_template

  PRODUCT_TEMPLATES = ['null', 'sets', 'configuration']
  validates_inclusion_of :product_template, in: PRODUCT_TEMPLATES
end
