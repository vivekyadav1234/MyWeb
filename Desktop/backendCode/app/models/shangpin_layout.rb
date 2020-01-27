# == Schema Information
#
# Table name: shangpin_layouts
#
#  id            :integer          not null, primary key
#  name          :string           not null
#  remark        :text
#  created_by_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class ShangpinLayout < ApplicationRecord
  belongs_to :created_by, class_name: 'User', required: true

  has_many :shangpin_jobs, as: :ownerable, dependent: :destroy

  def import_shangpin_into_layout(shangpin_job_ids, options = {})
    ShangpinJob.where(id: shangpin_job_ids).each do |shangpin_job|
      layout_job = shangpin_job.import_job_for_layout
      layout_job.ownerable = self
      layout_job.save!
    end
  end

  # Export to BOQ
  def export_shangpin_jobs(quotation, space)
    shangpin_jobs.each do |shangpin_job|
      quotation_job = shangpin_job.import_job_for_quotation(space)
      quotation_job.ownerable = quotation
      quotation_job.save!
    end

    quotation.set_amounts
    quotation.save!
    quotation
  end
end
