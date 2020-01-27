# For clubbed view in SLI creation screen.
class ClubbedView
  # using these values only but not using these objects, so commented them.
  # MASTER_INDEXES = {
  #   vendor_product_id: 0,
  #   vendor_id: 1,
  #   tax_percent: 2,
  #   tax_type: 3
  # }

  # CUSTOM_INDEXES = {
  #   element_name: 0,
  #   unit: 1,
  #   rate: 2,
  #   vendor_id: 3,
  #   tax_percent: 4,
  #   tax_type: 5
  # }

  def initialize(quotation, errors={})
    @quotation = quotation
    @job_elements_master = @quotation.job_elements.with_master_sli
    @job_elements_custom = @quotation.job_elements.without_master_sli
    @errors = errors
    # @unique_values_master = @job_elements_master.unique_column_values('master')
    # @unique_values_custom = @job_elements_custom.unique_column_values('custom')
    @hsh = Hash.new
  end

  def serialized_hash
    quotation_details
    @hsh[:master_slis] = master_job_details
    @hsh[:custom_slis] = custom_job_details
    return @hsh
  end

  def quotation_details
    @hsh = {
      id: @quotation.id,
      reference_number: @quotation.reference_number
    }
  end

  # grouped SLIs - hash: key will be the unique combination by which the SLIs have been grouped; value will be array of SLIs 
  # that have been grouped with those values.
  def master_job_details
    arr = []

    grouped_job_elements = @job_elements_master.includes(job_element_vendors: {purchase_elements: :purchase_order}).group_by do |je|
      jev = je.job_element_vendors.last
      [je.vendor_product_id, jev&.vendor_id, jev&.tax_percent, jev&.tax_type, je.cannot_modify?]
    end

    grouped_job_elements.each do |k, slis_to_club|
      arr << clubbed_sli_details(slis_to_club) if slis_to_club.count > 0
    end

    arr
  end

  # grouped SLIs - hash: key will be the unique combination by which the SLIs have been grouped; value will be array of SLIs 
  # that have been grouped with those values.
  def custom_job_details(options={})
    arr = []

    grouped_job_elements = @job_elements_custom.includes(job_element_vendors: {purchase_elements: :purchase_order}).group_by do |je|
      jev = je.job_element_vendors.last
      [je.element_name, je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type, je.cannot_modify?]
    end

    grouped_job_elements.each do |k, slis_to_club|
      arr << clubbed_sli_details(slis_to_club) if slis_to_club.count > 0
    end

    arr
  end

  private
  # Get the details of a clubbed line item in hash. slis_to_club is an array.
  def clubbed_sli_details(slis_to_club)
    clubbed_quantity = slis_to_club.map(&:quantity).compact.sum
    job_element = slis_to_club.first
    
    if @errors[:"#{job_element.id}"].present?
      {
        element_name: job_element.element_name,
        quantity: clubbed_quantity.round(5),
        unit: job_element.unit,
        rate: job_element.rate,
        amount: job_element.rate.to_f * clubbed_quantity,
        vendor_product_id: job_element.vendor_product_id,
        po_created: job_element.po_created?,
        modifying_po: job_element.modifying_po?,
        job_element_vendor_details: job_element.job_element_vendors.map{ |job_element_vendor|
          JobElementVendorSerializer.new(job_element_vendor).serializable_hash
        },
        subline_items: slis_to_club.map{ |sli|
          JobElementSerializer.new(sli).serializable_hash
        },
        errors: @errors[:"#{job_element.id}"]
      }
    else
      {
        element_name: job_element.element_name,
        quantity: clubbed_quantity.round(5),
        unit: job_element.unit,
        rate: job_element.rate,
        amount: job_element.rate.to_f * clubbed_quantity,
        vendor_product_id: job_element.vendor_product_id,
        po_created: job_element.po_created?,
        modifying_po: job_element.modifying_po?,
        job_element_vendor_details: job_element.job_element_vendors.map{ |job_element_vendor|
          JobElementVendorSerializer.new(job_element_vendor).serializable_hash
        },
        subline_items: slis_to_club.map{ |sli|
          JobElementSerializer.new(sli).serializable_hash
        }
      }
    end
  end
end
