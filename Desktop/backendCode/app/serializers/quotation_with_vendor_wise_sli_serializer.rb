class QuotationWithVendorWiseSliSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :reference_number, :sli_flag, :project_id
  attributes :vendor_line_items

  def vendor_line_items
    arr = []
    job_elements_ids = []
    object.get_job_elements_for_club_view.each do |sli_vendor|
      hash = Hash.new
      job_element = sli_vendor[1].first
      vendor_product = VendorProduct.find_by_sli_code(sli_vendor[0][0])
      hash[:sli_name] = vendor_product.sli_name
      hash[:vendor_name] = vendor_product.vendor.name
      hash[:vendor_id] = vendor_product.vendor_id
      hash[:vendor_product_id] = vendor_product.id
      hash[:unit] = vendor_product.unit_readable
      hash[:rate] = job_element.job_element_vendors.first.cost
      hash[:quantity] = sli_vendor[1].pluck(:quantity).sum
      job_elements_ids.push sli_vendor[1].pluck(:id)
      hash[:job_elements] = sli_vendor[1].map{|je| ClubedJobElementSerializer.new(je).serializable_hash}
      hash[:id] = sli_vendor[1].pluck(:id)
      hash[:quotation_id] = sli_vendor[1].first.quotation_id
      hash[:project_id] = sli_vendor[1].first.quotation.project.id
      arr.push(hash)
    end
    job_elements_ids =  job_elements_ids.flatten.uniq
    object.job_elements.where.not(id: job_elements_ids).each do |je|
      hash = Hash.new
      hash[:sli_name] = je.element_name
      hash[:vendor_name] = je.vendors&.first&.name
      hash[:vendor_id] = je.vendors&.first&.id
      hash[:vendor_product_id] = je.vendor_product&.id
      hash[:unit] = VendorProduct::UNITS.key(je.unit)
      hash[:rate] = je.job_element_vendors.present? ? je.job_element_vendors.first.cost : je.rate
      hash[:quantity] = je.quantity
      hash[:job_elements] = [ClubedJobElementSerializer.new(je).serializable_hash]
      hash[:id] = [je.id]
      hash[:quotation_id] = je.quotation_id
      hash[:project_id] = je.quotation.project.id
      arr.push(hash)
    end

    arr
  end
end

class ClubedJobElementSerializer < ActiveModel::Serializer
  attributes :id, :element_name, :quantity, :unit, :rate, :ownerable_type, :ownerable_id,
    :created_at, :updated_at, :quotation_id, :vendor_product_id
  attribute :line_item

  def line_item
    object.ownerable.present? ? ClubedLineItemsSerializer.new(object.ownerable, job_element: object).serializable_hash : []
  end
end

class ClubedLineItemsSerializer < ActiveModel::Serializer
  attributes :line_item_attributes, :type, :name, :clubbed_qty, :po_created

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
        object.name
      end
    else
      object.name
    end
  end

  def clubbed_qty
    instance_options[:job_element]&.quantity
  end

  def po_created
    instance_options[:job_element].purchase_elements.present? ? true : false
  end

end
