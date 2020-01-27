class FjaPreProductionPiUploadQuotationsSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :created_at, :reference_number

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :line_items do |object|
  	temp = []
    object.purchase_orders.each do |ele|
      items_hash = Hash.new
      items_hash[:purchase_order] = ele
      items_hash[:vendor] = ele.vendor
      amount = 0
      ele.purchase_elements.each do |e|
        amount += e.job_element_vendor.final_amount
      end
      items_hash[:amount] = amount
      temp << items_hash
    end
    temp
  end

end