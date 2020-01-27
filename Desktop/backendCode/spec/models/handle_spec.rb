# == Schema Information
#
# Table name: handles
#
#  id                        :integer          not null, primary key
#  code                      :string
#  handle_type               :string
#  price                     :float
#  handle_image_file_name    :string
#  handle_image_content_type :string
#  handle_image_file_size    :integer
#  handle_image_updated_at   :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  category                  :string
#  mrp                       :float
#  vendor_sku                :string
#  spec                      :string
#  make                      :string
#  unit                      :string
#  lead_time                 :integer          default(0)
#  arrivae_select            :boolean          default(FALSE), not null
#  handle_class              :string           default("normal"), not null
#  hidden                    :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe Handle, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
