class CategoryProjectHandoverListSerializer < ActiveModel::Serializer
  attributes :id,:lead_id, :client_name, :designer, :community_manager, :first_request_date, :last_request_date, :additional_file_requested,
  :new_handover_file, :display_counts , :handover_dashboard, :project_address

  def initialize(*args)
    super
    @lead = object.lead
  end

  def lead_id
    @lead.id
  end

  def client_name
    @lead.name
  end

  def designer
    object.assigned_designer&.name
  end

  def community_manager
    @lead.assigned_cm&.name
  end

  def first_request_date
    object.project_handovers.where(status: ["pending_acceptance", "accepted", "rejected"]).order(shared_on: :desc).last.shared_on
  end

  def last_request_date
    object.project_handovers.where(status: ["pending_acceptance", "accepted", "rejected"]).order(shared_on: :desc).first.shared_on
  end

  def additional_file_requested
    object.requested_files.where(resolved: false).count
  end

  def new_handover_file
    object.new_handover_file
  end

  def handover_dashboard
    hash = {}
    drawings_files = []
    bom_line_items = []
    #Files Counting in Acceptance
    rejected_count = 0
    accepted_count = 0
    project_handovers = object.project_handovers.where(parent_handover_id: nil).where.not(status: "pending")
    acceptance_files = project_handovers.count
    project_handovers.each do |project_handover|
      if project_handover.child_versions.present?
        if project_handover.child_versions.order(id: :asc).last.status == "accepted"
          accepted_count+= 1
        elsif project_handover.child_versions.order(id: :asc).last.status == "rejected" 
          rejected_count+= 1            
        end
      elsif project_handover.status == "rejected"
        rejected_count+= 1  
      elsif project_handover.status == "accepted"
        accepted_count+= 1
      end
    end if object.project_handovers.present?
    total_acceptance = acceptance_files - rejected_count
    accepted_acceptance = accepted_count
    #Production Drawing files
    handover_ids = object.project_handovers.where(status: "accepted").pluck(:id)  if object.project_handovers.present?
    drawings = ProductionDrawing.where(project_handover_id: handover_ids)
    drawings.each do |drawing|
      drawings_files << [drawing.line_item_type, drawing.line_item_id]
    end if drawings.present?

    quotations = object.quotations.project_handover_quotations.uniq
    total_line_items = 0
    total_line_items_in_bom = 0
    splited_line_items = 0
    production_drawings_count = 0
    bom_uploaded = 0
    send_to_factory = 0
    quotations.each do |quotation|
      jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a + quotation.shangpin_jobs.to_a
      total_line_items += jobs.count
      #splited line items
      splited_line_items += jobs.select{|job| job.tag.present?}.count
      #Number of line items where production drawing is present
      production_drawings_count += jobs.select{|job| job.production_drawings.present?}.count
      if splited_line_items == total_line_items
        #Number of line items in bom section
        bom_jobs = jobs.select{|job| !['services', 'non_panel_furniture'].include? job.tag.name if job.tag.present?}
        #BOM
        total_line_items_in_bom += bom_jobs.count
        no_bom_required =  bom_jobs.select{|job| [true].include? job.no_bom}.count
        bom_count = bom_jobs.select{|job| job.boms.present?}.count
        jobs.each do |job|
          bom_line_items << [job.class.name, job.id] if job.boms.present?
        end
        total_bom_uploaded = no_bom_required + bom_count
        bom_uploaded += total_bom_uploaded
      end  
    end
    files = bom_line_items + drawings_files
    send_to_factory = files.uniq.count
    hash["total_acceptance_files"] = total_acceptance
    hash["accepted_acceptance_files"] = accepted_acceptance
    hash["total_line_items"] =  total_line_items
    hash["splited_line_items"] = splited_line_items
    hash["production_drawings_count"] = production_drawings_count
    hash["total_line_items_in_bom"] = total_line_items_in_bom
    hash["bom_uploaded"] = bom_uploaded
    hash["send_to_factory"] = send_to_factory
    return hash
  end

  def display_counts
    hash = Hash.new
    handovers = object.project_handovers
    hash[:total_handover] = handovers&.count
    hash[:approved_handovers] = handovers&.where(status: "accepted")&.count
    hash
  end

  def project_address
    object.project_address
  end
end
