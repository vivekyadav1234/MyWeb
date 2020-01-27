class FjaPoSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :name, :created_at, :reference_number

  def serializable_hash
    data = super
    data[:data][:attributes]
  end

  attribute :project_details do |object|
    object.project
  end

  attribute :lead_name do |object|
    object.project.lead.name
  end

  attribute :vendor_details do |object|
    hash = JobElementVendor.where(job_element_id: object.job_element_ids).group_by(&:vendor_id)
    temp = Hash.new
    hash.each do |key, values|
      name = Vendor.find(key).name
      temp[name] = values
    end

    final_hash = Hash.new
    temp.each do |key, values|
      values_temp = []
      
      values.each do |value|
        purchase_order = object.purchase_orders.where(job_element_vendor_id: value.id).first
        if purchase_order.present?
          value_temp = {}
          name = value.job_element.element_name
          value_temp[:job_element_vendor_id] = value.id
          value_temp[:job_element_name] = name
          value_temp[:job_element_id] = value.job_element_id
          value_temp[:vendor_id] = value.vendor_id
          value_temp[:description] = value.description
          value_temp[:cost] = value.cost
          value_temp[:tax_percent] = value.tax_percent
          value_temp[:final_amount] = value.final_amount
          value_temp[:deliver_by_date] = value.deliver_by_date
          value_temp[:recommended] = value.recommended
          value_temp[:created_at] = value.created_at
          value_temp[:updated_at] = value.updated_at
          value_temp[:po_created] = purchase_order.present?
          value_temp[:status] = purchase_order.status
          value_temp[:purchase_order_id] = purchase_order.id
          value_temp[:shipping_address] = purchase_order.shipping_address
          value_temp[:milestone_details] = purchase_order.milestones
          value_temp[:quantity] = value.quantity
          value_temp[:unit_of_measurement] = value.unit_of_measurement
          value_temp[:tax_type] = value.tax_type
          value_temp[:tag_snag] = value.tag_snag
          
          values_temp << value_temp
        end
      end
      final_hash[key] = values_temp if values_temp.present?
    end
    final_hash.to_a
  end
end