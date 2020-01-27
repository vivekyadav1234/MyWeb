class MaterialTrackinSerializer < ActiveModel::Serializer
  attributes :id, :lead_id, :client, :designer, :community_manager, :reference_number, :payment_50, :payment_50_date, :sli_count

  def lead_id
    object.project.lead.id
  end

  def client
    object.project.lead&.name
  end

  def designer
    object.designer&.name
  end


  def community_manager
    object.designer&.cm&.name
  end

  def payment_50
    object.paid_amount.to_f >= (0.50*object.total_amount).to_f
  end

  def payment_50_date
  end

  def sli_count
    object.job_elements.count
  end
end


class MaterialTrackingPoDetails < ActiveModel::Serializer
  attributes :id, :element_name, :created_at, :updated_at, :quotation_id, :quantity, :unit, :qc_date, :vendor_name, :shipping_address,
  :dispatch_readiness_date, :current_address, :next_address, :dispatch_and_delivery_status, :qc_status, :qc_remarks, :dispatch_remarks

  def initialize(*args)
    super
    @last_dispatch = object.dispatch_schedules&.last
    @quality_check = object.quality_checks&.last
    @delivered = object.delivery_states&.last&.status.in?(["completed" , "partial"])
    @last_delivery = object.delivery_states&.last
  end

  def qc_remarks
    @quality_check&.remarks
  end

  def qc_status
    status = @quality_check&.qc_status
    if status == "not_needed"
      "not_needed".humanize.titleize
    elsif status == "scheduled"
      "QC Scheduled on #{@quality_check.qc_date&.strftime("%d-%b-%Y")}"
    elsif status == "rescheduled"
      "QC Rescheduled on #{@quality_check.qc_date&.strftime("%d-%b-%Y")}"
    elsif status == "completed"
      "QC Completed on #{@quality_check.created_at&.strftime("%d-%b-%Y")}"
    elsif status == "cancelled"
      "QC Cancelled on #{@quality_check.created_at&.strftime("%d-%b-%Y")}"
    elsif status == "partial"
      "QC Partial Completed on #{@quality_check.created_at&.strftime("%d-%b-%Y")}"
    end
  end

  def qc_date
    @quality_check&.qc_date&.strftime("%d-%b-%Y")
  end

  def vendor_name
      object.vendors&.first&.name
  end

  def shipping_address
    object.purchase_elements&.first&.purchase_order&.shipping_address
  end

  def dispatch_readiness_date
    date = object.dispatch_readinesses&.last&.readiness_date
    date.present? ?  "Dispatch Ready on #{date&.strftime("%d-%b-%Y")}" : "-"
  end

  def dispatch_remarks
    object.dispatch_readinesses&.last&.remarks
  end

  def current_address
    @delivered ? @last_dispatch&.shipping_address : @last_dispatch&.status == "complete" ? "-" : object.job_element_vendors&.last&.vendor&.address
  end

  def next_address
    @delivered ?   "-" : @last_dispatch&.shipping_address
  end

  def dispatch_and_delivery_status

    if @last_dispatch.present?
      if @last_delivery.present? && @last_delivery&.created_at > @last_dispatch&.created_at
        delivery_status
      else
        dispatch_status
      end
    elsif @last_delivery.present?
      delivery_status
    end
  end

  private

  def delivery_status
    @last_delivery.status == "completed" ? "Delivery Completed on #{@last_delivery.created_at.strftime("%d-%b-%Y")}" : "Partial Delivery Completed on #{@last_delivery.created_at.strftime("%d-%b-%Y")}"
  end

  def dispatch_status
    if @last_dispatch.status == "scheduled"
      "Dispatch Request Raised for #{@last_dispatch.schedule_date.strftime("%d-%b-%Y")}"
    elsif @last_dispatch.status == "complete"
      "Dispatch Completed on #{@last_dispatch.created_at.strftime("%d-%b-%Y")}"
    elsif @last_dispatch.status == "partial"
      "Partial Dispatch Completed on #{@last_dispatch.created_at.strftime("%d-%b-%Y")}"
    end
  end

end
