# == Schema Information
#
# Table name: lead_utm_contents
#
#  id         :integer          not null, primary key
#  name       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class LeadUtmContent < ApplicationRecord
	has_many :leads
  
  validates_presence_of :name
  validates_uniqueness_of :name
end
