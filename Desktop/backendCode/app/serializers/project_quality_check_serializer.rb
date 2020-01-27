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

class ProjectQualityCheckSerializer < ActiveModel::Serializer
  attributes :id, :qc_type, :status, :created_at, :updated_at, :file_url, :remark, :status_updated_user 

  def file_url
    object&.content&.document&.url
  end

  def status_updated_user
  	{name: object.status_updated_by&.name, email: object.status_updated_by&.email}
  end
end


class ProjectQualityCheckHistorySerializer < ProjectQualityCheckSerializer
end
