# == Schema Information
#
# Table name: dispatch_schedules
#
#  id               :integer          not null, primary key
#  job_element_id   :integer
#  remarks          :text
#  site             :string
#  billing_address  :string
#  shipping_address :string
#  created_by       :integer
#  status           :string
#  schedule_date    :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dispached_items  :text
#  pending_items    :text
#  dispatched_by    :text
#

class DispatchSchedule < ApplicationRecord
  has_paper_trail

  belongs_to :job_element
  has_many :contents, as: :ownerable, dependent: :destroy
  belongs_to :unscoped_job_element, -> { unscope(where: :added_for_partial_dispatch) }, class_name: 'JobElement', foreign_key: :job_element_id
  
  SITE_ARRAY = ["warehouse", "site"]
  # validates_inclusion_of :site, in: SITE_ARRAY

  STATUS_ARRAY = ["scheduled", "dispatched", "partial", "complete"]
  validates_inclusion_of :status, in: STATUS_ARRAY

end
