class ProjectPurchaseOrderSerializer < ActiveModel::Serializer
  attributes :id,:status, :contact_number, :contact_person, :shipping_address, :reference_no, :vendor_id, :created_at, :modifying
  attributes :job_elements, :vendor_name, :total, :vendor_gst, :tag_snag

  def job_elements
    arr = []
    clubbed_job_elements = object.job_elements.unscope(where: :po_cancelled_or_modifying).group_by do |je|
      jev = je.job_element_vendors.unscope(where: :po_cancelled_or_modifying).last
      [je.vendor_product_id, je.element_name.split("$clone$")[0], je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
    end
    clubbed_job_elements.each do |common_values, clubbed_slis|
      tax_percent = common_values[5]
      vp = VendorProduct.find_by_id(common_values[0])
      sample_je = clubbed_slis[0]
      quantity = clubbed_slis.map{|je| je.quantity}.sum.round(2)
      amount = clubbed_slis.map{|je| puts(je.id); je.job_element_vendors.unscope(where: :po_cancelled_or_modifying).last.cost.to_f}.sum
      final_amount = clubbed_slis.map{|je| je.job_element_vendors.unscope(where: :po_cancelled_or_modifying).last.final_amount.to_f}.sum
      hash = Hash.new
      hash[:sli_name] = sample_je.element_name.split("$clone$")[0]
      hash[:vendor_name] = sample_je.vendors&.first&.name
      hash[:vendor_id] = sample_je.vendors&.first&.id
      hash[:unit] = (VendorProduct::UNITS.key(common_values[2]) || common_values[2].to_s.humanize)
      hash[:rate] = common_values[3]
      hash[:quantity] = quantity
      hash[:tax]= tax_percent
      hash[:amount] = amount
      hash[:final_amount] = final_amount
      arr.push(hash)
    end
    arr
  end

  def vendor_name
    object.vendor&.name
  end

  def total
    object.job_element_vendors.unscope(where: :po_cancelled_or_modifying).pluck(:final_amount).sum.round(2)
  end

  def vendor_gst
    object.vendor_gst
  end

end

class ClubedJobElementSerializer < ActiveModel::Serializer
  attributes :id, :element_name, :quantity, :unit, :rate
  # attribute :line_item

  # def line_item
  #   object.ownerable.present? ? ClubedLineItemsSerializer.new(object.ownerable).serializable_hash : []
  # end
end

class ClubedLineItemsSerializer < ActiveModel::Serializer
  attributes :line_item_attributes, :type, :name

  def line_item_attributes
    object&.attributes
  end

  def type
    if object.class.name == "Boqjob"
      "boq_job"
    elsif object.class.name == "ModularJob"
      if object.category == "wardrobe"
        "modular_wardrobe"
      elsif object.category == "kitchen"
        "modular_kitchen"
      else
        nil
      end
    elsif object.class.name == "ServiceJob"
      "services"
    elsif object.class.name == "CustomJob"
      "custom_jobs"
    elsif object.class.name == "ApplianceJob"
      "appliance"
    elsif object.class.name == "ExtraJob"
      "extra"
    end
  end

  def name
    if object.class.name == "ModularJob"
      if object.category == "wardrobe"
        "Module Type: #{object.product_module&.module_type&.name.to_s}  Module :#{object.product_module&.code.to_s}"
      elsif object.category == "kitchen"
        "Module Type: #{object.product_module&.module_type&.name.to_s}  Module :#{object.product_module&.code.to_s}"
      else
        nil
      end
    else
      nil
    end
  end

end
