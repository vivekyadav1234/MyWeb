# == Schema Information
#
# Table name: hardware_elements
#
#  id                       :integer          not null, primary key
#  code                     :string
#  category                 :string
#  unit                     :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  hardware_type_id         :integer
#  hardware_element_type_id :integer
#

FactoryGirl.define do
  factory :hardware_element do
    
  end
end
