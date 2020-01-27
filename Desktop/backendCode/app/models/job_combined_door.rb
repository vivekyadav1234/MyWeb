# == Schema Information
#
# Table name: job_combined_doors
#
#  id               :integer          not null, primary key
#  modular_job_id   :integer
#  combined_door_id :integer
#  quantity         :integer          default(1)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class JobCombinedDoor < ApplicationRecord
  belongs_to :modular_job, required: true
  belongs_to :combined_door, required: true

  validate :wardrobe_only

  private
  # this mapping should belong to a job that is of the 'wardrobe' category only.
  def wardrobe_only
    errors.add(:modular_job_id, 'must be of category wardrobe only') unless modular_job.category == "wardrobe"
  end
end
