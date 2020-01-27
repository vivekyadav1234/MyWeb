require 'po_automation/po_automation_error'
require 'po_automation/po_automation_mkw_module_lm'

class PoAutomation
  include PoAutomationMkwModuleLm
  # line_item_array example: [{
  #   ownerable_type: 'Product',
  #   ownerable_id: 123
  #   },
  #   {
  #   ownerable_type: 'ModularJob', 
  #   ownerable_id: 12
  #   }
  # ]
  def initialize(quotation, procurement_method, line_item_array)
    @quotation = quotation
    @procurement_method = procurement_method
    @line_item_array = line_item_array
    @errors = []
  end

  # randomly populate SLIs from master data so that frontend has an end-point to work with.
  def populate_dummy_slis
    @line_item_array.each do |line_item_hash|
      3.times do 
        vendor_product = VendorProduct.joins(:master_line_item).where(master_line_items: {mli_type: @procurement_method}).sample
        @quotation.job_elements.create(
          element_name: vendor_product.sli_name, 
          quantity: 1.0, 
          unit: vendor_product.unit,  
          rate: vendor_product.rate, 
          ownerable_type: line_item_hash[:ownerable_type], 
          ownerable_id: line_item_hash[:ownerable_id], 
          vendor_product: vendor_product
          )
      end
      modular_job = line_item_hash[:ownerable_type].constantize.find(line_item_hash[:ownerable_id])
      @errors.push PoAutomation::Error.new("Sli not created", "No SLI found for MLI xyz.", modular_job).message_hash
    end

    @errors
  end

  # loop through the line items and add SLIs to them, if applicable.
  def populate_all_sli
    @line_item_array.each do |h|
      h = h.with_indifferent_access
      if h['ownerable_type'] == 'ModularJob'
        modular_job = ModularJob.find h['ownerable_id']
        case @procurement_method
        when 'lakhs_modular'
          lm_populate_mkw_sli_lakhs_modular(modular_job)
        when 'indoline'
          indoline_populate_mkw_sli_lakhs_modular(modular_job)
        else
          @errors.push PoAutomation::Error.new("No such procurement method", "No procurement method named #{@procurement_method} available.").message_hash
        end
      end
    end

    @errors
  end

  private
  # for lakhs modular, populate SLIs
  def lm_populate_mkw_sli_lakhs_modular(modular_job)
    lm_white_carcass_16mm(modular_job)   #16mm White Carcass
    lm_white_carcass_18mm(modular_job)     #18mm White Carcass
    lm_backing_laminate_one_side(modular_job)       #0.8mm White Laminates - Backing Laminate One Side
    lm_backing_laminate_one_side(modular_job)       #0.8mm White Laminates - Backing Laminate Other Side Side
    lm_backing_laminate_one_side_2(modular_job)     #0.8mm White Laminates for One Side Exposed Panels
    lm_backing_laminate_back_panel_one_side(modular_job)  #0.8mm Laminates for Back Panel on One Side
    lm_backing_laminate_back_panel_one_side(modular_job)  #0.8mm Laminates for Back Panel on Other Side Side
    lm_18mm_one_side_finished_panel(modular_job)    #18mm One Side Finished Panel
    lm_finish_material(modular_job)        #Finish Material
    lm_6mm_white_back_panel(modular_job)   #6mm White Back Panel
    lm_4mm_glass(modular_job)              #4mm Glass            
    lm_10mm_glass(modular_job)             #10mm Glass
    lm_aluminium_frame(modular_job)        #Aluminium Frame
    lm_addons(modular_job)                 #Add Ons
    lm_edge_banding(modular_job)           #0.8mm Edge Banding; 2mm Edge Banding
    lm_dry_fit(modular_job)                #Dry Fit
    lm_packaging(modular_job)              #Packaging
    lm_handles(modular_job)                #Normal Handles; Profile Handles; Concealed Handles; Insert Handles; Special Handles
    # lm_processing_p_c_eb_g_d(modular_job)  #Both Side P,C,EB,G,D
    # lm_processing_p_c_eb(modular_job)      #Both Side P,C,EB
    # lm_processing_p_c(modular_job)         #Both Side P,C
    lm_hardware(modular_job)               #Hardware
    lm_skirting(modular_job)               #Skirting
  end

  # for indoline, populate SLIs
  def indoline_populate_mkw_sli_lakhs_modular(modular_job)
    @errors.push PoAutomation::Error.new("No such procurement method", "Procurement method named #{@procurement_method} is under development and cannot be used right now.").message_hash
  end

  def add_sli_to_modular_job(modular_job, vendor_product, quantity)
    job_element = @quotation.job_elements.build(
      element_name: vendor_product.sli_name, 
      quantity: quantity, 
      unit: vendor_product.unit,  
      rate: vendor_product.rate, 
      ownerable_type: 'ModularJob', 
      ownerable_id: modular_job.id, 
      vendor_product: vendor_product
      )

    if job_element.save
      return true
    else
      @errors.push PoAutomation::Error.new("Sli not created", job_element.errors.full_messages, modular_job).message_hash
    end
  end
end
