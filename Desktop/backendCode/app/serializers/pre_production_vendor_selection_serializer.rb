class PreProductionVendorSelectionSerializer < PreProductionSliQuotationsSerializer
  attribute :sli_creation_time
  attribute :sli_without_vendor

  def sli_creation_time
    object.job_elements.last&.created_at
  end

  def sli_without_vendor
    object.job_elements.count - object.job_elements.joins(:vendors).distinct.count
  end

  # overriding following methods in parent serializer
  def unseen
    !object.vendor_selection_task&.seen
  end

  def tat
    object.vendor_selection_task&.end_time
  end

  def time_left
    end_time = object.vendor_selection_task&.end_time
    if end_time.present?
      str = time_ago_in_words(end_time)
      str << " ago" if Time.zone.now > end_time
      return str
    else
      return nil
    end
  end
end
