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

class QualityCheckSerializer < ActiveModel::Serializer
  attributes :id, :qc_status, :qc_date, :created_by, :created_by_name, :created_at, :updated_at, :remarks

  def created_by_name
    User.find_by_id(object.created_by)&.name
  end
end
