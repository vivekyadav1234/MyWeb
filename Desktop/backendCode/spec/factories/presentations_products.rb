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

FactoryGirl.define do
  factory :presentations_product do
    product nil
    presentation nil
  end
end
