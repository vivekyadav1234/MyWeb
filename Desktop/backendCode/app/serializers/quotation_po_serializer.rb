class QuotationPoSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :reference_number, :purchase_orders

  def purchase_orders
    po_arr = []
    object.purchase_orders.where(status: "released").each do |po|
      items_hash = Hash.new
      amount = 0
      items_hash[:id] = po.id
      items_hash[:status]= po.status
      items_hash[:contact_number] = po.contact_number
      items_hash[:reference_no] = po.reference_no
      items_hash[:contact_person] = po.contact_person
      items_hash[:po_created_at] = po.created_at
      items_hash[:vendor_name] = po.vendor&.name
      items_hash[:value] = po.job_element_vendors&.pluck(:final_amount)&.sum
      items_hash[:vendor_id] = po.vendor&.id
      items_hash[:mapped] = po.purchase_order_performa_invoices.present? ? true : false
      po_arr.push items_hash
    end
    po_arr
  end
end
