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

require 'rails_helper'

RSpec.describe PresentationsProduct, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
