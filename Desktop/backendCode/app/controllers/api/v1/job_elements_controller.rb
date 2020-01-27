class Api::V1::JobElementsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_project_and_quotations, except: [:destroy,:edit_po_qty, :post_dispatch_readiness_date, :get_dispatch_readiness_date,
    :post_dispatch_schedule_date, :post_delivery_state, :mt_history]
  before_action :set_job_element, only: [:show, :update, :destroy, :add_vendor, :remove_vendor,
    :update_vendor_details, :view_options, :change_master_sli, :update_sli_details, :set_alternate_sli, :line_item_details]
  load_and_authorize_resource :job_element

  def index
    @job_elements = @quotation.job_elements
    render json: @job_elements
  end

  # index for a given line item
  def index_by_job
    if params[:ownerable_type].blank? || params[:ownerable_type] == "Quotation"
      @job_elements = @quotation.job_elements.where(ownerable_type: nil)
    else
      unless params[:ownerable_type].present? && params[:ownerable_id].present?
        return render json: {message: "ownerable_type and ownerable_id must be present."}, status: 400
      end
      # DON'T REMOVE THIS CHECK - SECURITY HOLE OTHERWISE!!!
      check_allowed_class(params[:ownerable_type])
      @job_elements = params[:ownerable_type].constantize.find(params[:ownerable_id]).job_elements
    end

    render json: @job_elements
  end

  # for a given SLI, list the options available.
  # based on the sli_group_code of vendor_products to which this sli belongs.
  def view_options
    vendor_product = @job_element.vendor_product
    if vendor_product.blank? || vendor_product.sli_group_code.blank?
      @vendor_products = VendorProduct.none
    else
      @vendor_products = VendorProduct.where(sli_group_code: vendor_product.sli_group_code)
    end

    render json: @vendor_products
  end

  def show
    render json: @job_element
  end

  def line_item_details
    ownerable = @job_element.ownerable
    if ownerable.present? && @job_element.ownerable_type != 'ShangpinJob'
      case @job_element.ownerable_type
      when 'Boqjob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.product&.name, line_item_labels: ownerable&.boq_labels&.pluck(:label_name), labels: @job_element.boq_labels.pluck(:label_name)})
      when 'ModularJob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.product_module&.code, line_item_labels: ownerable&.boq_labels&.pluck(:label_name), labels: @job_element.boq_labels.pluck(:label_name)})
      when 'ServiceJob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.service_activity&.name})
      when 'ApplianceJob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.kitchen_appliance&.name, line_item_labels: ownerable&.boq_labels&.pluck(:label_name), labels: @job_element.boq_labels.pluck(:label_name)})
      when 'ExtraJob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.addon&.name, line_item_labels: ownerable&.boq_labels&.pluck(:label_name), labels: @job_element.boq_labels.pluck(:label_name)})
      when 'CustomJob'
        render json: JobElementSerializer.new(@job_element).serializable_hash.merge({name: ownerable.custom_element&.name, line_item_labels: ownerable&.boq_labels&.pluck(:label_name), labels: @job_element.boq_labels.pluck(:label_name)})
      else
        render json: { message: "Line item details not available for Custom Furniture section." }, status: 400
      end
    else
      render json: { message: "This SLI doesn't belong to any line item." }
    end
  end

  def clubbed_view
    render json: ClubbedView.new(@quotation).serialized_hash
  end

  def create
    @job_element = @quotation.job_elements.new(job_element_params)

    if @job_element.save!
      render json: @job_element, status: :created
    else
      render json: {message: @job_element.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # def update
  #   old_vendor_product_id = @job_element.vendor_product_id
  #   new_vendor_product_id = params[:job_element][:vendor_product_id].present? ? params[:job_element][:vendor_product_id].to_i : old_vendor_product_id
  #   if @job_element.update(job_element_update_params)
  #     if new_vendor_product_id == old_vendor_product_id
  #       @job_element.update_job_element_vendors
  #     else
  #       begin
  #         @job_element.job_element_vendors.destroy_all
  #         @job_element.populate_job_element_vendor
  #         @job_element.save
  #       rescue ActiveRecord::InvalidForeignKey
  #         render json: {message: "This item cannot be deleted as it is in use."}, status: :unprocessable_entity
  #       end
  #     end
  #     render json: @job_element
  #   else
  #     render json: {message: @job_element.errors.full_messages}, status: :unprocessable_entity
  #   end
  # end

  # def update_clubbed
  #   if params[:job_elements].present?
  #     je_ids = JSON.parse(params[:job_elements])
  #     # If any given job_element has a PO pending or released, then show an error.
  #     job_elements_with_po = JobElement.with_active_po.distinct
  #     if job_elements_with_po.present?
  #       return render json: { message: "Cannot update as the following SLIs have a PO pending or released - #{job_elements_with_po.pluck(:id)}" }
  #     end
  #     # pos.each do |po|
  #     #   if po.status.in?(["pending", "released"])
  #     #       j_ids = po.job_elements.pluck(:id)
  #     #       je_ids = je_ids - j_ids
  #     #   end
  #     # end
  #     je_ids.each do |je|
  #       job_element = JobElement.find_by_id je
  #       old_vendor_product_id = job_element.vendor_product_id
  #       new_vendor_product_id = params[:job_element][:vendor_product_id].present? ? params[:job_element][:vendor_product_id].to_i : old_vendor_product_id
  #       if job_element.update(job_element_update_params)
  #         if new_vendor_product_id == old_vendor_product_id
  #           job_element.update_job_element_vendors
  #         else
  #             job_element.job_element_vendors.destroy_all
  #             job_element.populate_job_element_vendor
  #             job_element.save
  #         end
  #       end
  #     end
  #     return render json: {message: "SLI Updated"}, status: 200
  #   end
  # end

  # After getting the list from view_options, one of those options is selected.
  # First, delete the current job_element.
  # Then create a new job_element.
  # Then populate the job_element_vendor.
  # def change_master_sli
  #   vendor_product = @job_element.vendor_product
  #   unless vendor_product.present?
  #     return render json: {message: "This is allowed only for SLIs which are linked to a Master SLI."}, status: :unprocessable_entity
  #   end
  #   new_vendor_product = VendorProduct.find params[:vendor_product_id]
  #   @new_job_element = @quotation.job_elements.new(
  #     element_name: new_vendor_product.sli_name,
  #     quantity: @job_element.quantity,
  #     unit: new_vendor_product.unit,
  #     rate: new_vendor_product.rate,
  #     quotation_id: @job_element.quotation_id,
  #     ownerable_type: @job_element.ownerable_type,
  #     ownerable_id: @job_element.ownerable_id,
  #     vendor_product_id: new_vendor_product.id
  #     )
  #   @job_element.destroy

  #   if @new_job_element.save
  #     @new_job_element.populate_job_element_vendor
  #     render json: @new_job_element, status: :created
  #   else
  #     render json: {message: @new_job_element.errors.full_messages}, status: :unprocessable_entity
  #   end
  #   rescue ActiveRecord::InvalidForeignKey
  #     render json: {message: "This item cannot be replaced as it is in use."}, status: :unprocessable_entity
  # end

  # def change_master_sli_clubbed
  #   if params[:job_elements].present?
  #     je_ids = JSON.parse(params[:job_elements])
  #     pos = PurchaseOrder.joins(purchase_elements: :job_elements).where(job_elements: {id: je_ids}).uniq
  #     pos.each do |po|
  #       if po.status.in?(["pending", "released"])
  #           j_ids = po.job_elements.pluck(:id)
  #           je_ids = je_ids - j_ids
  #       end
  #     end
  #     puts "======="
  #     puts "#{je_ids}"
  #     puts "======="
  #     je_ids.each do |je|
  #       job_element = JobElement.find_by_id je
  #       if job_element.present?
  #         vendor_product = job_element.vendor_product
  #         unless vendor_product.present?
  #           return render json: {message: "This is allowed only for SLIs which are linked to a Master SLI."}, status: :unprocessable_entity
  #         end
  #         new_vendor_product = VendorProduct.find params[:vendor_product_id]
  #         @new_job_element = @quotation.job_elements.new(
  #           element_name: new_vendor_product.sli_name,
  #           quantity: job_element.quantity,
  #           unit: new_vendor_product.unit,
  #           rate: new_vendor_product.rate,
  #           quotation_id: job_element.quotation_id,
  #           ownerable_type: job_element.ownerable_type,
  #           ownerable_id: job_element.ownerable_id,
  #           vendor_product_id: new_vendor_product.id
  #           )
  #         job_element.destroy
  #         @new_job_element.save
  #       end
  #     end
  #   end
  # end

  def set_alternate_sli
    vendor_product = @job_element.vendor_product
    unless vendor_product.present?
      return render json: {message: "This is allowed only for SLIs which are linked to a Master SLI."}, status: :unprocessable_entity
    end
    if @job_element.cannot_modify?
      return render json: {message: "This item cannot be edited as it is in use, possible in a PO."}, status: :unprocessable_entity
    end
    ActiveRecord::Base.transaction do
      set_single_alternate_sli(@job_element)
    end
    render json: { message: 'Alternative SLI updated'}
  end

  def set_alternate_sli_clubbed
    je_ids = JSON.parse(params[:job_elements])
    job_elements = @quotation.job_elements.where(id: je_ids)
    # If any given job_element has a PO pending or released, then show an error.
    job_elements_with_po = job_elements.where(id: je_ids).not_modifiable.distinct
    if job_elements_with_po.exists?
      return render json: { message: "Cannot update as the following SLIs have a PO pending or released - #{job_elements_with_po.pluck(:id)}" }, status: :unprocessable_entity
    end
    # Check if any of the given SLIs don't have a master SLI.
    if sli_custom = job_elements.where(vendor_product_id: nil).present?
      return render json: {message: "Cannot update as following SLIs have no master SLI - #{sli_custom.pluck(:id)}"}, status: :unprocessable_entity
    end

    # Now perform the update for each SLI.
    ActiveRecord::Base.transaction do
      job_elements.each do |job_element|
        set_single_alternate_sli(job_element)
      end
    end

    render json: { message: 'Alternative SLI updated for all given SLIs.'}
  end

  def destroy
    @job_element.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This item cannot be deleted as it is in use."}, status: :unprocessable_entity
  end

  def destroy_selected
    @quotation.job_elements.where(id: JSON.parse(params[:ids])).destroy_all
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "These items cannot be deleted as one or more of them are in use."}, status: 422
  end

  # Automatically generate SLIs for a given BOQ, procurement method and selected line items.
  def auto_populate_slis
    # errors = PoAutomation.new(@quotation, params[:procurement_method], params[:line_items]).populate_dummy_slis
    errors = PoAutomation.new(@quotation, params[:procurement_method], params[:line_items]).populate_all_sli

    render json: @quotation.reload, serializer: QuotationWithSliSerializer, po_automation_errors: errors
  end

  # add a vendor to a sub-item ie a job_element
  def add_vendor
    @job_element_vendor = @job_element.job_element_vendors.new(job_element_vendor_params)

    if @job_element_vendor.save
      @job_element_vendor.job_element.update(quantity: @job_element_vendor.quantity)
      #to mark the current task complete check if all elements are mapped
      @quotation.check_if_all_job_elements_are_mapped_with_vendors
      render json: @job_element.reload, status: :created
    else
      render json: {message: @job_element_vendor.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # note that this only removes a vendor mapping from the job_element, not delete the vendor itself!
  def remove_vendor
    @job_element_vendor = @job_element.job_element_vendors.find_by(vendor_id: params[:vendor_id])
    unless @job_element_vendor.purchase_elements&.first&.purchase_order&.status&.in?(["pending", "released"])
      begin
        @job_element_vendor.destroy
        render json: {message: "SLI Deleted"}, status: 200
      rescue ActiveRecord::InvalidForeignKey
        render json: {message: "This item cannot be deleted as it is in use."}, status: :unprocessable_entity
      end
    else
      render json: {message: "This item cannot be deleted as it is in use."}, status: :unprocessable_entity
    end

  end

  # modify mapping, not the vendor record itself!
  # unit, cost (ie rate), job_element_id cannot be changed on update
  def update_vendor_details
    @job_element_vendor = @job_element.job_element_vendors.find_by(vendor_id: params[:vendor_detail][:vendor_id])
    purchase_orders = @job_element_vendor.purchase_elements&.map(&:purchase_order)
    if (purchase_orders.present? and purchase_orders.detect {|po| po.status == 'pending' and po.modifying}.present?) || !purchase_orders&.map(&:status)&.detect {|ec| ec.in?(["pending", "released"])}.present?
    #if ((@job_element_vendor.purchase_elements&.first&.purchase_order&.status.in?(["pending"]) and @job_element_vendor.purchase_elements&.first&.purchase_order&.modifying) || !@job_element_vendor.purchase_elements&.first&.purchase_order&.status.in?(["pending", "released"]))
      if @job_element_vendor.update(job_element_vendor_update_params)
        @job_element_vendor.job_element.update(quantity: @job_element_vendor.quantity)
        return render json: @job_element_vendor
      else
        return render json: {message: @job_element_vendor.errors.full_messages}, status: :unprocessable_entity
      end
    else
      return render json: {message: "This item cannot be edited as it is in use."}, status: :unprocessable_entity
    end
  end

  # update a single SLI, including vendor details
  def update_sli_details
    @job_element_vendor = @job_element.job_element_vendors&.last
    purchase_orders = @job_element_vendor&.purchase_elements&.map(&:purchase_order)
    if @job_element.cannot_modify?
      return render json: {message: "This item cannot be edited as it is in use in a PO."}, status: :unprocessable_entity
    elsif @job_element.from_bom?
      return render json: {message: "This SLI cannot be edited individually as it is BOM imported. Please edit from clubbed view."}, status: :unprocessable_entity
    else
      ActiveRecord::Base.transaction do
        str = single_sli_edit(@job_element)
        # if  single_sli_edit methods is return type is string then its returning an error
        if str.class == String
          return render json: {message: str}, status: :unprocessable_entity
        end
      end
      render json: {message: "SLI Updated"}, status: 200
    end
  end

  # Same as :update_sli_details, except we do it for multiple SLIs
  def update_clubbed
    @errors = {}
    has_errors = false
    params[:clubbed_sub_line_items].each do |je_params|
      if je_params[:job_elements].present?
        je_ids = je_params[:job_elements]
        # If any given job_element has a PO pending or released, then show an error.
        job_elements_with_po = @quotation.job_elements.where(id: je_ids).not_modifiable.distinct
        if job_elements_with_po.exists?
          return render json: { message: "Cannot update as the following SLIs have a PO pending or released - #{job_elements_with_po.pluck(:id)}" }, status: :unprocessable_entity
        end
        # remove :quantity from je_params as it cannot be changed in clubbed format.
        je_params.delete(:quantity)
        # ActiveRecord::Base.transaction do
          je_ids.each do |je_id|
            job_element = @quotation.job_elements.find(je_id)
            str = single_sli_edit_for_mass(job_element, je_params)
            
            # if  single_sli_edit methods return type is string then its returning an error
            if str.class == String
              has_errors = true
              @errors.merge!({"#{job_element.id}": str})
              # return render json: {message: str}, status: :unprocessable_entity
            end
          end
        # end
      end
    end
    response = ClubbedView.new(@quotation, @errors).serialized_hash
    response.merge!({has_errors: has_errors})

    return render json: response, status: 200
  end

  # for uom conversion of clubbed slis - similar to :update_clubbed, but it is meant to be used for a single set of clubbed SLIs.
  # More will need modification, eg for error handling and reporting.
  def uom_conversion
    params[:clubbed_sub_line_items].each do |je_params|
      new_uom = je_params[:new_uom].to_s
      new_quantity = je_params[:updated_quantity].to_f
      unless new_uom.present? && new_quantity > 0
        return render json: {message: "Missing unit or quantity."}, status: 400
      end
      if je_params[:job_elements].present?
        je_ids = je_params[:job_elements]
        # If any given job_element has a PO pending or released, then show an error.
        job_elements_with_po = @quotation.job_elements.where(id: je_ids).not_modifiable.distinct
        if job_elements_with_po.exists?
          return render json: { message: "Cannot update as the following SLIs have a PO pending or released - #{job_elements_with_po.pluck(:id)}" }, status: :unprocessable_entity
        end
        current_quantity = @quotation.job_elements.where(id: je_ids).sum(:quantity)
        factor = ( current_quantity > 0.0 ) ? new_quantity/current_quantity : 0.0
        begin
          ActiveRecord::Base.transaction do
            je_ids.each do |je_id|
              job_element = @quotation.job_elements.find(je_id)
              job_element.update!(unit: new_uom, quantity: job_element.quantity.to_f * factor, rate: job_element.rate.to_f / factor)
              job_element_vendor = job_element.job_element_vendors.last
              if job_element_vendor.present?
                job_element_vendor.update!(unit_of_measurement: new_uom, quantity: job_element_vendor.quantity.to_f * factor, cost: job_element_vendor.cost.to_f / factor)
              end
            end
          end
        rescue ActiveRecord::RecordInvalid, ActiveRecord::Rollback
          return render json: {message: "Unit conversion failed. Please check your inputs."}, status: :unprocessable_entity
        end
      else
        return render json: {message: "No SLIs were provided."}, status: 400
      end
    end

    return render json: {message: "Successfully updated units."}, status: 200
  end

  def edit_po_qty
    if params[:job_elements].present?
      je_ids = JSON.parse(params[:job_elements])
      new_ids = []
      pos = PurchaseOrder.joins(purchase_elements: :job_elements).where(job_elements: {id: je_ids}).uniq
      # pos_ignore = pos.where(status: ['pending', 'released'])
      # job_elements = JobElement.where(id: je_ids).left_outer_joins(purchase_elements: :purchase_order).where.not(purchase_orders: {id: pos_ignore}).distinct
      pos.each do |po|
        if po.status.in?(["pending", "released"])
            j_ids = po.job_elements.pluck(:id)
            je_ids = je_ids - j_ids
        end
      end
      new_qty = params[:qty].to_f/je_ids.count
      je_ids.each do |j|
        job_element = JobElement.find(j)
        job_element.quantity = new_qty
        job_element.save
        job_element.update_job_element_vendors
      end
    end
    render json: {message: "Quantity Updated"}, status: 200
  end

  def post_dispatch_readiness_date
    if params[:job_element_ids].present?
      params[:job_element_ids].each do |job_element_id|
        je = JobElement.unscope(where: :added_for_partial_dispatch).find job_element_id
        je.dispatch_readinesses.create!(readiness_date: params[:readiness_date], remarks: params[:remarks], created_by: current_user.id)
        if params[:clubbed_job_elements_ids].present?
          if params[:clubbed_job_elements_ids]["#{job_element_id}"].present?
            params[:clubbed_job_elements_ids]["#{job_element_id}"].each do |clubbed_je|
              cje = JobElement.unscope(where: :added_for_partial_dispatch).find(clubbed_je)
              cje.dispatch_readinesses.create!(readiness_date: params[:readiness_date], remarks: params[:remarks], created_by: current_user.id)
            end
          end
        end
      end
      return render json: {message: "Dispatch Readiness Updated"}, status: 200
    else
      return render json: {message: "Please Select SLI's"}, status: 200
    end
  end

  def get_dispatch_readiness_date
    if params[:job_element_ids].present?
      params[:job_element_id].each do |job_element_id|
        je = JobElement.unscope(where: :added_for_partial_dispatch).find job_element_id
        je.dispatch_readinesses.create!(readiness_date: params[:readiness_date], remarks: params[:remarks], created_by: current_user.id)
      end
      return render json: {message: "Dispatch Date Updated"}, status: 200
    else
      return render json: {message: "Please Select SLI's"}, status: 204
    end
  end

  def post_dispatch_schedule_date
    if params[:job_element_ids].present?
      params[:job_element_ids].each do |job_element_id|
        je = JobElement.unscope(where: :added_for_partial_dispatch).find job_element_id
        status =  params[:status].present? ? params[:status] : "scheduled"
        dispatch_schedule = je.dispatch_schedules.new(schedule_date: params[:schedule_date], created_by: current_user.id, site: params[:site], billing_address: params[:billing_address],
           remarks: params[:remarks], status: status, dispached_items: params[:dispached_items], pending_items: params[:pending_items], dispatched_by: params[:dispatched_by])
        if status == "partial"
          po = je.unscoped_purchase_elements&.last&.purchase_order
          quotation_id = po.quotation.id
          ### added ownerable data to link new_je from parent je
          if je.ownerable_type == "JobElement"
            new_je = JobElement.new(ownerable: je.ownerable, quotation_id: quotation_id, added_for_partial_dispatch: true)
          else
            new_je = JobElement.new(ownerable: je, quotation_id: quotation_id, added_for_partial_dispatch: true)
          end
          new_je.save(validate: false)
          new_je.update_columns(element_name: params[:pending_items])
          new_je_vendor = JobElementVendor.new(job_element_id: new_je.id, vendor_id: po.vendor_id, added_for_partial_dispatch: true)
          new_je_vendor.save(validate: false)
          po.purchase_elements.create!(job_element_vendor_id: new_je_vendor.id)
        end
        if params[:clubbed_job_elements_ids].present?
          if params[:clubbed_job_elements_ids]["#{job_element_id}"].present?
            @clubbed_ids = params[:clubbed_job_elements_ids]["#{job_element_id}"]
            params[:clubbed_job_elements_ids]["#{job_element_id}"].each do |clubbed_je|
              cje = JobElement.unscope(where: :added_for_partial_dispatch).find clubbed_je
              cstatus =  params[:status].present? ? params[:status] : "scheduled"
              cdispatch_schedule = cje.dispatch_schedules.new(schedule_date: params[:schedule_date], created_by: current_user.id, site: params[:site], billing_address: params[:billing_address],
                remarks: params[:remarks], status: cstatus, dispached_items: params[:dispached_items], pending_items: params[:pending_items], dispatched_by: params[:dispatched_by])
              if cstatus == "partial"
                cpo = cje.unscoped_purchase_elements&.last&.purchase_order
                cquotation_id = cpo.quotation.id
                ### added ownerable data to link new_je from parent je
                if cje.ownerable_type == "JobElement"
                  cnew_je = JobElement.new(ownerable: cje.ownerable, quotation_id: cquotation_id, added_for_partial_dispatch: true)
                else
                  cnew_je = JobElement.new(ownerable: cje, quotation_id: cquotation_id, added_for_partial_dispatch: true)
                end
                cnew_je.save(validate: false)
                cnew_je.update_columns(element_name: params[:pending_items])
                cnew_je_vendor = JobElementVendor.new(job_element_id: cnew_je.id, vendor_id: cpo.vendor_id, added_for_partial_dispatch: true)
                cnew_je_vendor.save(validate: false)
                cpo.purchase_elements.create!(job_element_vendor_id: cnew_je_vendor.id)
              end
              if cdispatch_schedule.save!
                cshipping_address = cdispatch_schedule.status == "scheduled" ? params[:shipping_address] : cje.dispatch_schedules.last(2).first.shipping_address
                cdispatch_schedule.shipping_address =  cshipping_address
                cdispatch_schedule.save
                if params[:files].present?
                  params[:files].each do |file|
                    cdispatch_schedule.contents.create!(document: file[:attachment], scope: "dispatch_schedule", document_file_name: file[:file_name])
                  end
                end
              end
            end
          else
            @clubbed_ids = []
          end
        else
          @clubbed_ids = []
        end
        if dispatch_schedule.save!
          shipping_address = dispatch_schedule.status == "scheduled" ? params[:shipping_address] : je.dispatch_schedules.last(2).first.shipping_address
          dispatch_schedule.shipping_address =  shipping_address
          dispatch_schedule.save
          if params[:files].present?
            params[:files].each do |file|
              dispatch_schedule.contents.create!(document: file[:attachment], scope: "dispatch_schedule", document_file_name: file[:file_name])
            end
          end
          UserNotifierMailer.dispatch_schedule(dispatch_schedule,@clubbed_ids).deliver_now!
        end
      end
      return render json: {message: "Dispatch Updated"}, status: 200
    else
      return render json: {message: "Please Select SLI's"}, status: 204
    end
  end

  def post_delivery_state
    if params[:job_element_ids].present?
      params[:job_element_ids].each do |job_element_id|
        je = JobElement.unscope(where: :added_for_partial_dispatch).find job_element_id
        status =  params[:status]
        dispatch_schedule = je.delivery_states.new(created_by: current_user.id, status: status, dispached_items: params[:dispached_items], pending_items: params[:pending_items])
        if dispatch_schedule.save!
          if status == "partial"
            po = je.unscoped_purchase_elements&.last&.purchase_order
            quotation_id = po.quotation.id
            ### added ownerable data to link new_je from parent je
            if je.ownerable_type == "JobElement"
              new_je = JobElement.create(ownerable: je.ownerable, quotation_id: quotation_id, added_for_partial_dispatch: true, element_name: params[:pending_items])
            else
              new_je = JobElement.create(ownerable: je, quotation_id: quotation_id, added_for_partial_dispatch: true, element_name: params[:pending_items])
            end
            new_je_vendor = JobElementVendor.new(job_element_id: new_je.id, vendor_id: po.vendor_id, added_for_partial_dispatch: true)
            new_je_vendor.save(validate: false)
            po.purchase_elements.create!(job_element_vendor_id: new_je_vendor.id)
          end
        end
        if params[:clubbed_job_elements_ids].present?
          if params[:clubbed_job_elements_ids]["#{job_element_id}"].present?
            params[:clubbed_job_elements_ids]["#{job_element_id}"].each do |clubbed_je|
              cje = JobElement.unscope(where: :added_for_partial_dispatch).find clubbed_je
              cstatus =  params[:status]
              cdispatch_schedule = cje.delivery_states.new(created_by: current_user.id, status: cstatus, dispached_items: params[:dispached_items], pending_items: params[:pending_items])
              if cdispatch_schedule.save!
                if cstatus == "partial"
                  cpo = cje.unscoped_purchase_elements&.last&.purchase_order
                  cquotation_id = po.quotation.id
                  ### added ownerable data to link new_je from parent je
                  if cje.ownerable_type == "JobElement"
                    cnew_je = JobElement.create(ownerable: cje.ownerable, quotation_id: cquotation_id, added_for_partial_dispatch: true, element_name: params[:pending_items])
                  else
                    cnew_je = JobElement.create(ownerable: cje, quotation_id: cquotation_id, added_for_partial_dispatch: true, element_name: params[:pending_items])
                  end
                  cnew_je_vendor = JobElementVendor.new(job_element_id: cnew_je.id, vendor_id: cpo.vendor_id, added_for_partial_dispatch: true)
                  cnew_je_vendor.save(validate: false)
                  cpo.purchase_elements.create!(job_element_vendor_id: cnew_je_vendor.id)
                end
              end
            end
          end
        end
      end
      return render json: {message: "Delivery Updated"}, status: 200
    else
      return render json: {message: "Please Select SLI's"}, status: 200
    end
  end

  def mt_history
    unless params[:job_element_id].present?
      return render json: {message: "Please select SLI"}, status:200
    end
    history = JobElement.material_tracking_history(params[:tab_name], params[:job_element_id])
    return render json: {history: history}, status: 200
  end


  private
  # Use callbacks to share common setup or constraints between actions.
    def set_project_and_quotations
      @quotation = Quotation.find params[:quotation_id]
      @project = @quotation.project
    end

    def set_job_element
      @job_element = JobElement.find params[:id]
    end

    # Only allow a trusted parameter "white list" through.
    def job_element_params
      params.require(:job_element).permit(:element_name, :quantity, :unit, :rate,
        :ownerable_type, :ownerable_id, :quotation_id, :vendor_product_id, :qc_date)
    end

    # only allow change in some basic attributes, not the BOQ, line item or the vendor_product
    # separate end-point if need to change vendor_product.
    def job_element_update_params
      params.require(:job_element).permit(:element_name, :quantity, :unit, :rate, :vendor_product_id)
    end

    def job_element_vendor_params
      params.require(:vendor_detail).permit(:job_element_id, :vendor_id, :description, :cost,
        :tax_percent, :deliver_by_date, :recommended, :tax_type, :unit_of_measurement, :quantity)
    end

    def job_element_vendor_update_params
      params.require(:vendor_detail).permit(:vendor_id, :description,
        :tax_percent, :deliver_by_date, :recommended, :tax_type, :quantity, :cost)
    end

    def check_allowed_class(klass_name)
      unless ['Boqjob', 'ModularJob', 'ServiceJob', 'ApplianceJob', 'CustomJob', 'ExtraJob'].include?(klass_name)
        return render json: {message: "#{klass_name} is not an allowed line item type!"}, status: :unauthorized
      else
        true
      end
    end

    # used by end-points
    def single_sli_edit(job_element)
      if job_element.job_element_vendors&.last&.vendor_id == params[:vendor_id]
        job_element_vendor = job_element.job_element_vendors&.last
        job_element_vendor.assign_attributes(cost: params[:rate],
          tax_percent: params[:tax_percent], tax_type: params[:tax_type], unit_of_measurement: params[:unit])
      else
        job_element.job_element_vendors.destroy_all
        job_element_vendor = job_element.job_element_vendors.build(vendor: Vendor.find_by_id(params[:vendor_id]), cost: params[:rate],
          tax_percent: params[:tax_percent], tax_type: params[:tax_type], unit_of_measurement: params[:unit])
      end
      job_element.assign_attributes(element_name: params[:name],
        unit: params[:unit], rate: params[:rate], vendor_product_id: params[:vendor_product_id])
      job_element.quantity = params[:quantity] if params[:quantity]
      job_element_vendor.quantity = job_element.quantity  #Make sure the jev and je qty are in sync
      
      # if !job_element.rate.present?
      #   job_element.errors.add(:rate, "cannot be blank")
      # elsif job_element.rate.present? && job_element.rate == 0
      #   job_element.errors.add(:rate, "must be greater than 0")
      # end
      if !params[:rate].present?
        return "SLI errors - rate cannot be 0."
      end

      if params[:rate].present? && params[:rate] == 0
        return "SLI errors - rate must be greater than 0."
      end
      
      job_element.save!
      job_element_vendor.save!
      return job_element
    rescue
      error_str = "SLI errors - #{job_element.errors.full_messages}."
      error_str += "Vendor errors - #{job_element_vendor.errors.full_messages}." if job_element_vendor.errors.present?
      return error_str
    end

    # used by end-points
    # for clubbed SLI edits, params[:quantity] must be nil!!!
    def single_sli_edit_for_mass(job_element, je_params)
      job_element.assign_attributes(element_name: je_params[:name],
        unit: je_params[:unit], rate: je_params[:rate], vendor_product_id: je_params[:vendor_product_id])
      job_element.quantity = je_params[:quantity] if je_params[:quantity]
      
      if !je_params[:rate].present?
        return "SLI errors - rate cannot be 0."
      end

      if je_params[:rate].present? && je_params[:rate] == 0
        return "SLI errors - rate must be greater than 0."
      end

      if job_element.save
        # do this only if :vendor_id is provided
        if je_params[:vendor_id].present?
          if job_element.job_element_vendors&.last&.vendor_id == je_params[:vendor_id]
            job_element_vendor = job_element.job_element_vendors&.last
            job_element_vendor.assign_attributes(cost: je_params[:rate],
              tax_percent: je_params[:tax_percent], tax_type: je_params[:tax_type], unit_of_measurement: je_params[:unit])
          else
            job_element.job_element_vendors.destroy_all
            job_element_vendor = job_element.job_element_vendors.build(vendor: Vendor.find_by_id(je_params[:vendor_id]), cost: je_params[:rate],
              tax_percent: je_params[:tax_percent], tax_type: je_params[:tax_type], unit_of_measurement: je_params[:unit])
          end
          job_element_vendor.quantity = job_element.quantity  #Make sure the jev and je qty are in sync
          if job_element_vendor.save
          else
            return "Vendor errors - #{job_element_vendor.errors.full_messages}."
          end
        end
        return job_element
      else
        return "SLI errors - #{job_element.errors.full_messages}."
      end
    end


    # used by end-points
    def set_single_alternate_sli(job_element)
      new_vendor_product = VendorProduct.find params[:vendor_product_id]
      jlv = job_element.job_element_vendors&.last
      job_element.job_element_vendors.destroy_all

      job_element.update!(element_name: new_vendor_product.sli_name, quantity: job_element.quantity,
        unit: new_vendor_product.unit, rate: new_vendor_product.rate, vendor_product_id: new_vendor_product.id)

      new_jlv = job_element.job_element_vendors.build(vendor: new_vendor_product.vendor, cost: new_vendor_product.rate,
          tax_percent: jlv&.tax_percent, tax_type: jlv&.tax_type, unit_of_measurement: new_vendor_product.unit,
          quantity: job_element.quantity)

      new_jlv.save!
      return job_element
    rescue
      error_str = "SLI errors - #{job_element.errors.full_messages}."
      error_str += "Vendor errors - #{new_jlv.errors.full_messages}." if new_jlv&.errors.present?
      return render json: { message: error_str }, status: :unprocessable_entity
    end

    # eg 'ModularJob' becomes 'modular_jobs'
    def association_name(klass_name)
      klass_name.underscore.pluralize
    end
end
