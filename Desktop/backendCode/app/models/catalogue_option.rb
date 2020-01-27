# == Schema Information
#
# Table name: catalogue_options
#
#  id                   :integer          not null, primary key
#  name                 :string
#  master_sub_option_id :integer
#  minimum_price        :float
#  maximum_price        :float
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class CatalogueOption < ApplicationRecord
  has_paper_trail
  belongs_to :master_sub_option
  has_many :product_variants
end
