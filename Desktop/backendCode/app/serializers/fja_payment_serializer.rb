# 2-12-2019: Changed as now object is Payment. However, most of the code here is written based on object being
# Quotation Payment. Ideally, it should be rewritten. For now, we will just write 'qp workaround' wherever we are
# doing the workaround.
class FjaPaymentSerializer
  # This Serializer for client payment history.
  include FastJsonapi::ObjectSerializer
  
  attributes :id
  
  attributes :payment do |object|
    PaymentSerializer.new(object).serializable_hash
  end

  attributes :past_payments do |object|
    # qp workaround
    qp = object.quotation_payments.first
    parent_boq = qp.quotation.parent_quotation
    parent_payments = 0
    if parent_boq.present?
      boq_payments = parent_boq.quotation_payments.includes(payment: :project).where(payments: {is_approved: true})
      parent_payments = boq_payments.map(&:amount).compact.reduce(&:+).to_f
    end
    prev_payments = qp.quotation.quotation_payments.includes(payment: :project).where(payments: {is_approved: true}).map(&:amount).compact.reduce(&:+).to_f
    total_past_payments = prev_payments + parent_payments
    prev_percentage = ((total_past_payments/qp.quotation.total_amount) * 100).round(2)
    {
      parent_boq: parent_boq&.reference_number,
      parent_payments: parent_payments,
      prev_payments: prev_payments,
      amount: total_past_payments,
      percentage: prev_percentage
    }
    #binding.pry
  end

  attributes :quotation_details do |object|
    # qp workaround
    qp = object.quotation_payments.first
    quotation = qp.quotation
    boq = qp.payment.quotations
    booking_forms = quotation.project.project_booking_form
    booking_forms = ProjectBookingFormSerializer.new(booking_forms).serializable_hash if booking_forms.present?

    balance_amount = 0

    if quotation.paid_amount.present?
      balance_amount = quotation.total_amount - quotation.paid_amount
    else
      balance_amount = quotation.total_amount
    end
  # project_id: quotation.project_id, 
      boq.map {|quot| {
      project_id: quot.project_id,
      quotation_id: quot.id, 
      reference_number: quot.reference_number,
      net_amount: quot.net_amount,
      total_amount: quot.total_amount,
      signed_booking_forms: booking_forms,
      balance_amount: balance_amount,
      stage: quot.final_boq? ? 'Final' : 'Initial',
      cm: quot.project&.lead&.assigned_cm&.name,
      designer: quot.project&.assigned_designer&.name,
      parent_boq: quot.parent_quotation&.reference_number,
      project_address: quot.project&.project_address
      # signed_boq_url: quot.last_signed_boq&.document&.url
    }
  }
    #binding.pry
  end

  attributes :percentage_and_amount do |object|
    # qp workaround
    qp = object.quotation_payments.first
    paid_amount = qp.payment.amount
    quotations = qp.payment.quotations
    total_quotation_amount = quotations.pluck(:total_amount).sum.to_f
    total_pending_amount = quotations.map{|quotation| quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount}.sum
    quotation = qp.quotation
    q_per = ((quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount)/total_pending_amount).to_f
    
    amount = qp.amount.present? ? qp.amount : q_per * paid_amount

    boq_per = amount/qp.quotation.total_amount
    {amount: amount.round(2), percentage: (boq_per * 100).round(2)}
  end

end

#This Serializer for client ledger.
class CompletedPaymentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :created_at, :updated_at, :amount

  attribute :quotation_details do |object|
    quotation = object.quotation
    {project_id: quotation.project_id, quotation_id: quotation.id, reference_number: quotation.reference_number, net_amount: quotation.net_amount, total_amount: quotation.total_amount}
  end

  attribute :client_details do |object|
    lead = object.quotation.project.lead
    {id: lead.id, name: lead.name}
  end
end