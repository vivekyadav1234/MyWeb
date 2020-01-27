# == Schema Information
#
# Table name: vendor_categories
#
#  id                 :integer          not null, primary key
#  category_name      :string
#  parent_category_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

FactoryGirl.define do
  factory :vendor_category do
    category_name "MyString"
    vendor_category_id "MyString"
    vendor_category nil
  end
end
