class PreProductionPaymentReleaseSerializer < PreProductionSliQuotationsSerializer
  attribute :pi_upload_time
  attribute :pi_without_payment_release

  def pi_upload_time
    object.performa_invoices.order(id: :desc).limit(1).take&.created_at
  end

  def pi_without_payment_release
    object.performa_invoices.with_no_pi_payment.count
  end

  # overriding following methods in parent serializer
  def unseen
    !object.payment_release_task&.seen
  end

  def tat
    object.payment_release_task&.end_time
  end

  def time_left
    end_time = object.payment_release_task&.end_time
    if end_time.present?
      str = time_ago_in_words(end_time)
      str << " ago" if Time.zone.now > end_time
      return str
    else
      return nil
    end
  end
end
