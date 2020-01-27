# This is for use when rendering line items of a BOQ. So only include attributes needed for that,
# and not even one more!
class ServiceJobLineItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :unit, :quantity, :base_rate, :installation_rate,
    :final_rate, :amount, :space, :service_activity_id, :lead_time

  attribute :service_activity
  attribute :disable_base_rate

  def initialize(*args)
    super
    @service_activity = object.service_activity
  end

  def service_activity
    @service_activity&.name
  end

  def disable_base_rate
    @service_activity&.default_base_price.nil?
  end
end
