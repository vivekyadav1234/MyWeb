# == Schema Information
#
# Table name: product_modules
#
#  id                        :integer          not null, primary key
#  code                      :string
#  description               :string
#  width                     :integer
#  depth                     :integer
#  height                    :integer
#  category                  :string
#  modular_product_id        :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  module_type_id            :integer
#  number_kitchen_addons     :integer
#  module_image_file_name    :string
#  module_image_content_type :string
#  module_image_file_size    :integer
#  module_image_updated_at   :datetime
#  number_shutter_handles    :integer
#  number_door_handles       :integer
#  c_section_length          :integer          default(0)
#  l_section_length          :integer          default(0)
#  c_section_number          :integer          default(0)
#  l_section_number          :integer          default(0)
#  special_handles_only      :boolean          default(FALSE)
#  percent_18_reduction      :boolean          default(FALSE)
#  al_profile_size           :float            default(0.0)
#  lead_time                 :integer          default(0)
#  hidden                    :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe ProductModule, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
