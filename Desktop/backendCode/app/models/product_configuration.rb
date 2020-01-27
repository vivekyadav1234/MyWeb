# == Schema Information
#
# Table name: product_configurations
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  code        :string
#  section_id  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ProductConfiguration < ApplicationRecord
  belongs_to :section

  has_many :products

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:section_id]
  validates_uniqueness_of :code, scope: [:section_id], allow_blank: true
end
