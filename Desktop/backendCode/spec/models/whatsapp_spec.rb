# == Schema Information
#
# Table name: whatsapps
#
#  id             :integer          not null, primary key
#  to             :string
#  ownerable_type :string
#  ownerable_id   :integer
#  message        :string
#  response       :json
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe Whatsapp, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
