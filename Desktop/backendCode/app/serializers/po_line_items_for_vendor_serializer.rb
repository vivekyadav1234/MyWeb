class PoLineItemsForVendorSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :reference_number, :lead_name, :vendor_items


  # def project_details
  #   object.project
  # end

  def lead_name
    object.project.lead.name
  end

  def vendor_items
    v_ids = JobElementVendor.where(job_element_id: object.job_element_ids).pluck(:vendor_id).uniq
    temp = []
    v_ids.each do |id|
      hash = Hash.new
      hash[:vendor_details] = VendorSerializer.new(Vendor.find(id)).serializable_hash
      vendor_job_elements = object.job_elements.joins(vendor_product: :vendor).where(vendors: {id: id}).group_by{|e| [e.sli_code, e.unit]}
      if vendor_job_elements.present?
        hash[:items] = []
        vendor_job_elements.map{ |sli_vendor|
          new_hash = Hash.new
          vendor_product = VendorProduct.find_by_sli_code(sli_vendor[0][0])
          new_hash[:sli_name] = vendor_product.sli_name
          new_hash[:unit] = vendor_product.unit_readable
          new_hash[:rate] = vendor_product.rate
          new_hash[:quantity] = sli_vendor[1].pluck(:quantity).sum
          new_hash[:value] = new_hash[:rate] * new_hash[:quantity]
          new_hash[:job_elements] = sli_vendor[1].map{|je| ClubedJobElementSerializer.new(je).serializable_hash}
          hash[:items].push new_hash
        }
      else
        hash[:items] = []
        JobElementVendor.where(job_element_id: object.job_element_ids, vendor_id: id).map{|element|
          je = element.job_element
          new_hash = Hash.new
          new_hash[:sli_name] = je.element_name
          new_hash[:unit] = VendorProduct::UNITS.key(je.unit)
          new_hash[:rate] = je.rate
          new_hash[:quantity] = je.quantity
          new_hash[:job_elements] = ClubedJobElementSerializer.new(je).serializable_hash
          hash[:items].push new_hash
        }
      end
      temp << hash
    end
    temp
  end

end

class ClubedJobElementSerializer < ActiveModel::Serializer
  attributes :id, :element_name, :quantity, :unit, :rate, :ownerable_type, :ownerable_id,
    :created_at, :updated_at, :quotation_id, :vendor_product_id
  attribute :line_item

  def line_item
    object.ownerable.present? ? ClubedLineItemsSerializer.new(object.ownerable).serializable_hash : []
  end
end

class ClubedLineItemsSerializer < ActiveModel::Serializer
  attributes :type, :name, :line_item_attributes

  def line_item_attributes
    [object.attributes]
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
