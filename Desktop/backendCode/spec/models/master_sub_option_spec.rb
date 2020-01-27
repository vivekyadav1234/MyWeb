# == Schema Information
#
# Table name: master_sub_options
#
#  id               :integer          not null, primary key
#  name             :string
#  master_option_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe MasterSubOption, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
