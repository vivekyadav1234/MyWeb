# == Schema Information
#
# Table name: carcass_elements
#
#  id                      :integer          not null, primary key
#  code                    :string
#  width                   :integer
#  depth                   :integer
#  height                  :integer
#  length                  :float
#  breadth                 :float
#  thickness               :float
#  edge_band_thickness     :integer
#  area_sqft               :float
#  category                :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  carcass_element_type_id :integer
#

FactoryGirl.define do
  factory :carcass_element do
    
  end
end
