# == Schema Information
#
# Table name: service_jobs
#
#  id                  :integer          not null, primary key
#  name                :string
#  service_code        :string
#  unit                :string
#  quantity            :float
#  base_rate           :float
#  installation_rate   :float
#  final_rate          :float
#  amount              :float
#  space               :string
#  ownerable_type      :string
#  ownerable_id        :integer
#  service_activity_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  estimated_cogs      :float            default(0.0)
#  clubbed_job_id      :integer
#  tag_id              :integer
#  no_bom              :boolean          default(FALSE), not null
#

class ServiceJobSerializer < ActiveModel::Serializer
  attributes :id, :name, :service_code, :unit, :quantity, :base_rate, :installation_rate,
    :final_rate, :amount, :space, :ownerable_id, :ownerable_type, :service_activity_id

  attribute :service_activity
  attribute :disable_base_rate

  def service_activity
    object.service_activity&.name
  end

  def disable_base_rate
    object.service_activity&.default_base_price.nil?
  end
end

class BusinessServiceJobSerializer < ServiceJobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end
end
