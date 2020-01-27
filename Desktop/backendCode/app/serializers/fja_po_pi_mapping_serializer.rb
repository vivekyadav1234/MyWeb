class FjaPoPiMappingSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :vendor_details do |object|
  	object.performa_invoice.vendor
  end
  
  attribute :purchase_order_details do |object|
    object.purchase_order
  end

  attribute :performa_invoice_details do |object|
    object.performa_invoice
  end

  attribute :purchase_elements do |object|
    temp = []
    object.purchase_order.purchase_elements.each do |ele|
      items_hash = Hash.new
      items_hash[:purchase_element_id] = ele.id
      items_hash[:element_name] = ele.job_element_vendor.job_element.element_name
      temp << items_hash
    end
    temp
  end

  attribute :payment_status do |object|
    object.performa_invoice.payments.joins(:quotation_payments).pluck("quotation_payments.purchase_element_ids").flatten.uniq.include?(object.performa_invoice.purchase_orders.joins(:purchase_elements).pluck("purchase_elements.id").last.to_s)
  end

  attribute :milestones do |object|
    object.purchase_order.milestones
  end

end