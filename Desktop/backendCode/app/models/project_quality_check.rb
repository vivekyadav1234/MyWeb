# == Schema Information
#
# Table name: project_quality_checks
#
#  id         :integer          not null, primary key
#  qc_type    :string
#  project_id :integer
#  status     :boolean
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  remark     :text
#

class ProjectQualityCheck < ApplicationRecord
  has_paper_trail
  has_one :content, as: :ownerable, dependent: :destroy
  belongs_to :project
  belongs_to :status_updated_by, class_name: "User"

  ALLOWED_TYPES = %w(design_qc cost_qc tech_qc)
  validates_inclusion_of :qc_type, in: ALLOWED_TYPES

  scope :design_qcs, -> {where(qc_type: "design_qc")}
  scope :cost_qcs, -> {where(qc_type: "cost_qc")}
  scope :tech_qcs, -> {where(qc_type: "tech_qc")}

end
