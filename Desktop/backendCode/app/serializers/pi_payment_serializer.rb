# == Schema Information
#
# Table name: pi_payments
#
#  id                      :integer          not null, primary key
#  description             :string           not null
#  remarks                 :string
#  percentage              :float            not null
#  payment_status          :string           default("pending"), not null
#  status_updated_at       :datetime
#  payment_due_date        :datetime
#  performa_invoice_id     :integer
#  created_by_id           :integer
#  approved_by_id          :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  attachment_file_name    :string
#  attachment_content_type :string
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  transaction_number      :string
#  amount                  :float
#

class PiPaymentSerializer < ActiveModel::Serializer
  attributes :id, :payment_status, :percentage, :amount, :message, :updated_time, :transaction_number, :remarks

  def message
    case object.payment_status
    when "pending"
      "Request Pending for Approval"
    when "rejected"
      "Payment Cancelled"
    when "approved"
      "Request Approved by #{object.approved_by.name}"
    end
  end

  def updated_time
    case object.payment_status
    when "pending"
      object.updated_at
    when "rejected"
      object.status_updated_at
    when "approved"
      object.status_updated_at
    end
  end
end
