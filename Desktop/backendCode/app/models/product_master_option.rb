# == Schema Information
#
# Table name: product_master_options
#
#  id               :integer          not null, primary key
#  product_id       :integer
#  master_option_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class ProductMasterOption < ApplicationRecord
  has_paper_trail
  belongs_to :product
  belongs_to :master_option
  validates_uniqueness_of :product, scope: :master_option
end
