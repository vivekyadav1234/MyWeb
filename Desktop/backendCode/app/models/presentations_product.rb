# == Schema Information
#
# Table name: presentations_products
#
#  id              :integer          not null, primary key
#  product_id      :integer
#  presentation_id :integer
#  quantity        :integer
#  space           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class PresentationsProduct < ApplicationRecord
  has_paper_trail
  belongs_to :product
  belongs_to :presentation
end
