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

class ScopeQna < ApplicationRecord
  has_paper_trail
  
  belongs_to :scope_space
end
