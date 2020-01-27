# == Schema Information
#
# Table name: product_variants
#
#  id                        :integer          not null, primary key
#  name                      :string
#  product_variant_code      :string
#  catalogue_option_id       :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  fabric_image_file_name    :string
#  fabric_image_content_type :string
#  fabric_image_file_size    :integer
#  fabric_image_updated_at   :datetime
#

FactoryGirl.define do
  factory :product_variant do
    name "MyString"
    catalogue_option ""
  end
end
