# == Schema Information
#
# Table name: modular_products
#
#  id                   :integer          not null, primary key
#  name                 :string
#  modular_product_type :string
#  space                :string
#  price                :float
#  section_id           :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

require 'rails_helper'

RSpec.describe ModularProduct, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
