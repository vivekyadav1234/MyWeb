# == Schema Information
#
# Table name: quality_checks
#
#  id             :integer          not null, primary key
#  job_element_id :integer
#  qc_status      :string
#  qc_date        :datetime
#  created_by     :integer
#  remarks        :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class QualityCheck < ApplicationRecord
  has_paper_trail

  has_many :contents, as: :ownerable, dependent: :destroy
  belongs_to :job_element
  belongs_to :unscoped_job_element, -> { unscope(where: :added_for_partial_dispatch) }, class_name: 'JobElement', foreign_key: :job_element_id

  QC_STATUS = ["not_needed","scheduled","rescheduled","completed","partial","cancelled"]
  validates_inclusion_of :qc_status,  in: QC_STATUS

end
