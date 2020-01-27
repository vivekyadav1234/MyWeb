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

FactoryGirl.define do
  factory :product_master_option do
    references ""
    references ""
  end
end
