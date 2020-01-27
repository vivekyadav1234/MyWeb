# == Schema Information
#
# Table name: wip_slis
#
#  id                :integer          not null, primary key
#  quantity          :float            default(0.0)
#  tax_type          :string
#  tax               :float
#  amount            :float
#  vendor_product_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  status            :string           default("pending")
#  vendor_id         :integer
#  name              :string
#  unit              :string
#  rate              :float
#  custom            :boolean
#  sli_type          :string
#

class WipSliSerializer
	include FastJsonapi::ObjectSerializer


  def serializable_hash
    data = super
    data[:data]
  end

  attributes :id, :quantity, :tax_type, :tax, :amount, :status, :created_at, :updated_at, :custom

  attribute :sli_name do |object|
		object.vendor_product.present? ? object.vendor_product.sli_name : object.name
  end

  attribute :unit do |object|
  	object.vendor_product.present? ? object.vendor_product.unit : object.unit
  end

  attribute :rate do |object|
  	object.vendor_product.present? ? object.vendor_product.rate : object.rate
  end

  attribute :vendor_name do |object|
  	object.vendor&.name
  end

	attribute :po_status do |object|
		object.po_wip_orders&.last&.status&.humanize&.titleize
	end

	attribute :po_created_at do |object|
		object.po_wip_orders&.last&.created_at&.strftime("%d-%m-%Y")
	end

	attribute :vendor_product_id do |object|
		object.vendor_product&.id
	end

	attribute :po_name do |object|
		object.po_wip_orders&.last&.po_name
	end

	attribute :po_tag_snag do |object|
		object.po_wip_orders&.last&.tag_snag
	end	
end
