class FjaPoLineItemsSerializer
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
    arr = []
    vendor_mappings = JobElementVendor.includes(:job_element, {purchase_elements: :purchase_order}).where(job_element_id: object.job_element_ids).group_by(&:vendor_id)
    temp = Hash.new
    # key is :vendor_id
    vendor_mappings.each do |key, grouped_jevs|
      @vendor = Vendor.find(key)
      temp[@vendor.name] = grouped_jevs
    end

    # Create PO os allowed for these.
    # grouped_jevs is an array of job_element_vendors. Club these as per the logic of the clubbed view class.
    temp.each do |key, grouped_jevs|
      final_hash = Hash.new
      total_value = 0
      element_count = 0
      vendor = Vendor.find_by(name: key)
      purchase_order = object.purchase_orders.where(vendor_id: vendor.id).last
      values_temp = []
      status_arr = []
      # only include those job_element_vendors which can be included for create po. This will reduce later queries and logic headache.
      jev_ids = grouped_jevs.find_all{|jev| jev.include_in_create_po?}.map(&:id)
      # Now, group by the SLIs which will be clubbed. Unlike the SLI creation clubbed view, we will use a common grouping logic
      # here, not separate for custom and master.
      final_grouped_jevs = grouped_job_elements = JobElementVendor.includes(:job_element, {purchase_elements: :purchase_order}).where(id: jev_ids).group_by do |jev|
        je = jev.job_element
        [je.vendor_product_id, je.element_name, je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
      end

      # format is something like {common_value1 => array of jevs with those common values}
      final_grouped_jevs.each do |common_values, values|
        value_temp = {}
        name = common_values[1]
        # job_element_vendor = JobElementVendor.find_by(vendor_id: vendor.id, job_element_id: value.job_element_id)
        # purchase_order = job_element_vendor&.purchase_elements&.last&.purchase_order
        # value_temp[:job_element_vendor_id] = value.id
        value_temp[:job_element_name] = name
        value_temp[:job_element_id] = values.map(&:job_element_id)
        value_temp[:vendor_id] = common_values[4]
        # value_temp[:description] = values[0].description
        value_temp[:cost] = common_values[3]
        value_temp[:tax_percent] = common_values[5]
        value_temp[:final_amount] = values.map(&:final_amount).compact.sum
        # value_temp[:deliver_by_date] = values[0].deliver_by_date
        # value_temp[:recommended] = value.recommended
        # value_temp[:created_at] = value.created_at
        # value_temp[:updated_at] = value.updated_at
        # value_temp[:status] =  (purchase_order.present? && purchase_order.status.present?) ? purchase_order.status : ""
        # status_arr.push value_temp[:status]
        # value_temp[:purchase_order_id] = purchase_order&.id
        # value_temp[:purchase_order_reference_no] = purchase_order&.reference_no
        # value_temp[:shipping_address] = purchase_order&.shipping_address
        value_temp[:quantity] = values.map(&:quantity).compact.sum.round(5)
        value_temp[:unit_of_measurement] = common_values[2]
        value_temp[:tax_type] = common_values[6]
        # value_temp[:modifying] = purchase_order.present? ? purchase_order.modifying : false
        # if job_element_vendor.include_in_create_po?
        total_value += value_temp[:final_amount]
        element_count += 1
        values_temp << value_temp
        # end
      end
      # if status_arr.include?("")
      #   st = ""
      # elsif status_arr.include?("pending")
      #   st = "pending"
      # end
      final_hash[:id] = vendor.id
      final_hash[:name] = vendor.name
      # final_hash[:status] = st
      final_hash[:total_value] = total_value.round(2)
      final_hash[:element_count] = element_count
      final_hash[:job_elements] = values_temp
      final_hash[:vendor_data] = VendorSerializer.new(vendor).serializable_hash
      arr.push(final_hash) if element_count > 0
    end

    arr
  end

  attribute :purchase_orders do |object|
    temp = []
    object.purchase_orders.each do |po|
      hash = Hash.new
      hash[:po_details] = ProjectPurchaseOrderSerializer.new(po).serializable_hash
      temp << hash
    end
    temp
  end
end
