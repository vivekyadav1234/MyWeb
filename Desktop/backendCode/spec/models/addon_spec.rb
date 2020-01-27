# == Schema Information
#
# Table name: addons
#
#  id                       :integer          not null, primary key
#  code                     :string
#  name                     :string
#  specifications           :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  category                 :string
#  addon_image_file_name    :string
#  addon_image_content_type :string
#  addon_image_file_size    :integer
#  addon_image_updated_at   :datetime
#  vendor_sku               :string
#  extra                    :boolean          default(FALSE)
#  mrp                      :float
#  allowed_in_custom_unit   :boolean          default(FALSE)
#  lead_time                :integer          default(0)
#  hidden                   :boolean          default(FALSE), not null
#  arrivae_select           :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe Addon, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
