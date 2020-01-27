# == Schema Information
#
# Table name: gm_cm_mappings
#
#  id         :integer          not null, primary key
#  gm_id      :integer
#  cm_id      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GmCmMapping < ApplicationRecord
  belongs_to :gm, class_name: 'User', required: true
  belongs_to :cm, class_name: 'User', required: true

  validates_uniqueness_of :cm_id, scope: [:gm_id]
end
