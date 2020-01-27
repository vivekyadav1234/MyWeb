# == Schema Information
#
# Table name: project_handover_urls
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  url            :text
#  shared_version :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class ProjectHandoverUrl < ApplicationRecord
  belongs_to :project
  has_many :contents, as: :ownerable, dependent: :destroy

  before_create :increase_version

  def increase_version
    ver = ProjectHandoverUrl.where(project_id: self.project_id)&.last&.shared_version
    if ver.present? && ver >= 1
      self.shared_version = ver + 1
    else
      self.shared_version = 1
    end
  end
end
