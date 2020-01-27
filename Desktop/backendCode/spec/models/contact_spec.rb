# == Schema Information
#
# Table name: contacts
#
#  id           :integer          not null, primary key
#  phone_number :string
#  source       :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'rails_helper'

RSpec.describe Contact, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
