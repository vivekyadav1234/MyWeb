# == Schema Information
#
# Table name: master_options
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class MasterOption < ApplicationRecord
  has_paper_trail
  has_many :master_sub_options
  has_many :product_master_options
  has_many :master_options, through: :product_master_options
  validates_uniqueness_of :name
end
