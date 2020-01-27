# == Schema Information
#
# Table name: project_handovers
#
#  id                 :integer          not null, primary key
#  project_id         :integer
#  ownerable_type     :string
#  ownerable_id       :integer
#  file_version       :integer
#  status             :string           default("false")
#  shared_on          :datetime
#  status_changed_on  :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  remarks            :string
#  parent_handover_id :integer
#  created_by         :integer
#  category_upload    :boolean          default(FALSE)
#

class ProjectHandoverSerializer < ActiveModel::Serializer
  attributes :id,:project_id,:ownerable_type,:ownerable_id,:file_version,:status,:shared_on,:status_changed_on,:created_at,:updated_at
  attribute :segments_with_acceptance

  def segments_with_acceptance
    object.segments_with_acceptance
  end
end
