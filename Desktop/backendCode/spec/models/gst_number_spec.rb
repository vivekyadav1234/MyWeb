# == Schema Information
#
# Table name: gst_numbers
#
#  id             :integer          not null, primary key
#  gst_reg_no     :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe GstNumber, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
