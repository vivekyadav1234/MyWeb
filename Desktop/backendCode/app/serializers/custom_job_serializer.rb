# == Schema Information
#
# Table name: custom_jobs
#
#  id                :integer          not null, primary key
#  ownerable_type    :string
#  ownerable_id      :integer
#  name              :string
#  space             :string
#  quantity          :integer
#  rate              :float
#  amount            :float
#  custom_element_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  estimated_cogs    :float            default(0.0)
#  clubbed_job_id    :integer
#  tag_id            :integer
#  no_bom            :boolean          default(FALSE), not null
#

class CustomJobSerializer < ActiveModel::Serializer
  attributes :id, :name, :quantity, :rate, :amount, :space, :ownerable_id, :ownerable_type, 
    :custom_element_id, :custom_element, :dimension, :core_material, :shutter_finish, :photo, 
    :timeline


  attribute :custom_element
  attribute :category_remark
  attribute :labels

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def custom_element
    object.custom_element&.name
  end

  def category_remark
    object.custom_element&.category_remark
  end

  def dimension
  	object.custom_element&.dimension
  end

  def core_material
  	object.custom_element&.core_material
  end

  def shutter_finish
  	object.custom_element&.shutter_finish
  end

  def photo
  	object.custom_element&.photo
  end

  def timeline
    object.custom_element&.timeline
  end
end

class BusinessCustomJobSerializer < CustomJobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end
end
