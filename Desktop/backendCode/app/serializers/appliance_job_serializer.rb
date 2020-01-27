# == Schema Information
#
# Table name: appliance_jobs
#
#  id                   :integer          not null, primary key
#  name                 :string
#  make                 :string
#  rate                 :float
#  quantity             :float
#  amount               :float
#  space                :string
#  ownerable_type       :string
#  ownerable_id         :integer
#  kitchen_appliance_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  vendor_sku           :string
#  specifications       :string
#  warranty             :string
#  estimated_cogs       :float            default(0.0)
#  clubbed_job_id       :integer
#  tag_id               :integer
#  no_bom               :boolean          default(FALSE), not null
#

class ApplianceJobSerializer < ActiveModel::Serializer
  attributes :id, :name, :make, :rate, :quantity, :amount, :space, :ownerable_type,
    :ownerable_id, :kitchen_appliance_id, :created_at, :updated_at, :vendor_sku, 
    :specifications, :warranty

  attribute :subcategory
  attribute :image_url
  attribute :lead_time
  attribute :labels

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def lead_time
    object.kitchen_appliance&.lead_time || 0
  end
  
  def subcategory
    object.kitchen_appliance.module_type&.name
  end

  def image_url
  	object.kitchen_appliance.appliance_image.url
  end
end


class BusinessApplianceJobSerializer < ApplianceJobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end

end
