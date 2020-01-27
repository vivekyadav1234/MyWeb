class PreProductionPoReleaseSerializer < PreProductionSliQuotationsSerializer
  attribute :sli_creation_time
  attribute :sli_without_po

  def sli_creation_time
    object.job_elements.last&.created_at
  end

  def sli_without_po
    object.job_elements.left_outer_joins(:purchase_elements).where(purchase_elements: { id: nil }).count
  end

  # overriding following methods in parent serializer
  def unseen
    !object.po_release_task&.seen
  end

  def tat
    object.po_release_task&.end_time
  end

  def time_left
    end_time = object.po_release_task&.end_time
    if end_time.present?
      str = time_ago_in_words(end_time)
      str << " ago" if Time.zone.now > end_time
      return str
    else
      return nil
    end
  end
end
