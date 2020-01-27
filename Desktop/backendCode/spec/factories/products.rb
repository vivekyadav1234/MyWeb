# == Schema Information
#
# Table name: products
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  sale_price                   :float
#  section_id                   :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  image_name                   :string
#  model_no                     :string
#  color                        :string
#  finish                       :string
#  product_config               :string
#  length                       :integer
#  width                        :integer
#  height                       :integer
#  vendor_sku                   :string
#  vendor_name                  :string
#  vendor_location              :string
#  cost_price                   :float
#  model3d_file                 :string
#  manufacturing_time_days      :integer
#  product_url                  :string
#  material                     :text
#  dimension_remark             :text
#  warranty                     :string
#  remark                       :text
#  measurement_unit             :string
#  qty                          :integer
#  unique_sku                   :string
#  product_configuration_id     :integer
#  parent_product_id            :integer
#  product_image_file_name      :string
#  product_image_content_type   :string
#  product_image_file_size      :integer
#  product_image_updated_at     :datetime
#  lead_time                    :integer
#  hidden                       :boolean          default(FALSE)
#  units_sold                   :integer          default(0)
#  origin                       :string           default("arrivae"), not null
#  imported_sku                 :string
#  last_imported_at             :datetime
#  catalog_type                 :string           default("arrivae"), not null
#

FactoryGirl.define do
  factory :product do
    
  end
end
