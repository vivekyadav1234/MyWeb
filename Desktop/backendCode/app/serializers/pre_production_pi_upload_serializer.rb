class PreProductionPiUploadSerializer < PreProductionSliQuotationsSerializer
  attribute :sli_creation_time
  attribute :po_without_pi

  def sli_creation_time
    object.job_elements.last&.created_at
  end

  def po_without_pi
    object.purchase_orders.left_outer_joins(:performa_invoices).where(performa_invoices: { id: nil }).count
  end

  # overriding following methods in parent serializer
  def unseen
    !object.pi_upload_task&.seen
  end

  def tat
    object.pi_upload_task&.end_time
  end

  def time_left
    end_time = object.pi_upload_task&.end_time
    if end_time.present?
      str = time_ago_in_words(end_time)
      str << " ago" if Time.zone.now > end_time
      return str
    else
      return nil
    end
  end
end
