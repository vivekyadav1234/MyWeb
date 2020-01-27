# == Schema Information
#
# Table name: alternate_contacts
#
#  id             :integer          not null, primary key
#  name           :string
#  contact        :string
#  relation       :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe AlternateContact, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
