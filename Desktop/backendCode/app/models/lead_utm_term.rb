# == Schema Information
#
# Table name: lead_utm_terms
#
#  id         :integer          not null, primary key
#  name       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class LeadUtmTerm < ApplicationRecord
	has_many :leads
  
  validates_presence_of :name
  validates_uniqueness_of :name
end
