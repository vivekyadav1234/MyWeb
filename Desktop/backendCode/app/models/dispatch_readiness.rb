# == Schema Information
#
# Table name: dispatch_readinesses
#
#  id             :integer          not null, primary key
#  job_element_id :integer
#  readiness_date :datetime
#  remarks        :text
#  created_by     :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class DispatchReadiness < ApplicationRecord
  has_paper_trail

  belongs_to :job_element

end
