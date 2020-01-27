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

FactoryGirl.define do
  factory :product_configuration do
    
  end
end
