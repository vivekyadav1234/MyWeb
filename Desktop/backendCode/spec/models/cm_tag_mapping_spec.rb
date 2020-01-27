# == Schema Information
#
# Table name: cm_tag_mappings
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  tag_id     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe CmTagMapping, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
