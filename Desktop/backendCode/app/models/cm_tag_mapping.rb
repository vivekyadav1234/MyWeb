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

class CmTagMapping < ApplicationRecord
  belongs_to :user
  belongs_to :tag
end
