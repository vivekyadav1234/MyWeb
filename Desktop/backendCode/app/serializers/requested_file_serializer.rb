# == Schema Information
#
# Table name: requested_files
#
#  id           :integer          not null, primary key
#  raised_by_id :integer
#  resolved     :boolean          default(FALSE)
#  project_id   :integer
#  resolved_on  :datetime
#  remarks      :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class RequestedFileSerializer < ActiveModel::Serializer
  attributes :id, :raised_by_id, :resolved, :project_id, :remarks, :created_at, :updated_at
end
