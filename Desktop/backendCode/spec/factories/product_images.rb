# == Schema Information
#
# Table name: product_images
#
#  id                         :integer          not null, primary key
#  product_image_file_name    :string
#  product_image_content_type :string
#  product_image_file_size    :integer
#  product_image_updated_at   :datetime
#  image_name                 :string
#  product_id                 :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#

FactoryGirl.define do
  factory :product_image do
    
  end
end
