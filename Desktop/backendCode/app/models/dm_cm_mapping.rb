class DmCmMapping < ApplicationRecord
  belongs_to :dm, class_name: 'User', required: true
  belongs_to :cm, class_name: 'User', required: true

  validates_uniqueness_of :cm_id, scope: [:dm_id]
end