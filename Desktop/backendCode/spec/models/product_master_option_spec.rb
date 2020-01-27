# == Schema Information
#
# Table name: product_master_options
#
#  id               :integer          not null, primary key
#  product_id       :integer
#  master_option_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe ProductMasterOption, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
