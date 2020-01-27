class CompletePoWipOrderSerializer
	include FastJsonapi::ObjectSerializer


  def serializable_hash
    data = super
    data[:data]
  end

  attributes :id, :po_name, :status #, :billing_address, :billing_contact_person, :billing_contact_number, :shipping_address, :shipping_contact_number, :shipping_contact_person, :created_at, :updated_at
  
  attribute :line_items do |object|
    # po_wip_orders_wip_slis = 
    arr = []
    object.po_wip_orders_wip_slis.where(parent_wip_sli: nil).each do |po_wip_orders_wip_sli|
      hash = {}
      hash[:wip_orders_wip_slis_id] = po_wip_orders_wip_sli.id
      hash[:recieved_date] = po_wip_orders_wip_sli.updated_at
      hash[:wip_sli] = WipSliSerializer.new(po_wip_orders_wip_sli.wip_sli).serializable_hash
      hash[:recieved_quantity] = po_wip_orders_wip_sli.recieved_quantity
      hash[:quantity] = po_wip_orders_wip_sli.quantity
      hash[:child_wip_orders_wip_slis] = []
      po_wip_orders_wip_sli.child_wip_slis.each do |child_wip_sli|
        child_hash = {}
        child_hash[:child_wip_orders_wip_slis_id] = child_wip_sli.id
        child_hash[:quantity] = child_wip_sli.quantity
        child_hash[:recieved_date] = child_wip_sli.updated_at
        child_hash[:recieved_quantity] = child_wip_sli.recieved_quantity
        child_hash[:wip_sli] = WipSliSerializer.new(child_wip_sli.wip_sli).serializable_hash
        hash[:child_wip_orders_wip_slis].push(child_hash)
      end
      arr.push(hash)
    end
    arr
  end
end