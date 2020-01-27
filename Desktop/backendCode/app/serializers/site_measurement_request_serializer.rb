# == Schema Information
#
# Table name: site_measurement_requests
#
#  id                :integer          not null, primary key
#  project_id        :integer
#  designer_id       :integer
#  sitesupervisor_id :integer
#  request_type      :string
#  address           :text
#  scheduled_at      :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  request_status    :string           default("pending")
#  rescheduled_at    :datetime
#  remark            :text
#  name              :string           default("site_measurement_output")
#

class SiteMeasurementRequestSerializer < ActiveModel::Serializer
	attributes :id, :request_type, :address, :scheduled_at, :rescheduled_at, :project, :designer, :sitesupervisor, :request_status, :remark

	def project
	  object.project.slice(:id,:name)
	end

	def designer
	  object.designer.slice(:id,:email,:name) if object.designer.present?
	end

	def sitesupervisor
	  object.sitesupervisor.slice(:id,:email,:name) if object.sitesupervisor.present?
	end
end
