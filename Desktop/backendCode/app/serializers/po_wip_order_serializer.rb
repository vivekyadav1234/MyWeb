# == Schema Information
#
# Table name: po_wip_orders
#
#  id                      :integer          not null, primary key
#  po_name                 :string
#  status                  :string           default("pending")
#  billing_address         :text
#  billing_contact_person  :string
#  billing_contact_number  :string
#  shipping_address        :text
#  shipping_contact_number :string
#  shipping_contact_person :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  lead_id                 :integer
#  vendor_gst              :string
#  po_type                 :string
#  tag_snag                :boolean          default(FALSE), not null
#

class PoWipOrderSerializer
	include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data]
  end

  attributes :id, :po_name, :status, :billing_address, :billing_contact_person, :billing_contact_number, :shipping_address, :shipping_contact_number,
	:shipping_contact_person, :created_at, :updated_at, :vendor_gst, :lead_id, :tag_snag

  attribute :line_items do |object|
    # po_wip_orders_wip_slis =
    arr = []
    object.po_wip_orders_wip_slis.where(parent_wip_sli: nil).each do |po_wip_orders_wip_sli|
      hash = {}
      hash[:wip_orders_wip_slis_id] = po_wip_orders_wip_sli.id
      hash[:wip_sli] = WipSliSerializer.new(po_wip_orders_wip_sli.wip_sli).serializable_hash
      arr.push(hash)
    end
    arr
  end
end
