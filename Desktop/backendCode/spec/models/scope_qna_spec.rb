# == Schema Information
#
# Table name: scope_qnas
#
#  id             :integer          not null, primary key
#  scope_space_id :integer
#  question       :text
#  arrivae_scope  :text
#  client_scope   :text
#  remark         :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe ScopeQna, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
