# == Schema Information
#
# Table name: payments
#
#  id                  :integer          not null, primary key
#  project_id          :integer
#  quotation_id        :integer
#  payment_type        :string
#  amount_to_be_paid   :float
#  mode_of_payment     :string
#  bank                :string
#  branch              :string
#  date_of_checque     :date
#  amount              :float
#  date                :datetime
#  is_approved         :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  payment_status      :string
#  image_file_name     :string
#  image_content_type  :string
#  image_file_size     :integer
#  image_updated_at    :datetime
#  remarks             :string
#  payment_stage       :string
#  transaction_number  :string
#  ownerable_id        :integer
#  ownerable_type      :string
#  description         :string
#  finance_approved_at :datetime
#

class PaymentSerializer < ActiveModel::Serializer
  attributes :id, :payment_type, :amount_to_be_paid, :mode_of_payment,
    :bank, :branch, :date_of_checque,
    :amount, :date, :is_approved, :created_at, :updated_at, :payment_status,
    :image,:remarks, :payment_stage, :transaction_number, :project_id

  attributes :lead_id, :lead_name, :approved_by

  def payment_type
    case object.payment_type
    when "initial_design"
      return 'Initial Payment'
    when "final_design"
      return '40% Payment'
    when "final_payment"
      return "Final 50% Payment"
    else
      return object.payment_type
    end
  end

  def lead_id
    object.project.lead_id
  end

  def lead_name
    object.project.lead.name
  end

  def approved_by

  end
end

class PaymentHistorySerializer < PaymentSerializer
  attribute :quotation_payments

  def quotation_payments
    object.quotations.map do |quotation|
      QuotationSerializer.new(quotation).serializable_hash
    end
  end
end

class PaymentHistoryDetailSerializer < PaymentSerializer
  attributes :quotation_payments, :finance_status, :created_at,
  :image_file_name, :image_content_type,
  :image_file_size, :image_updated_at, :finance_approved_at#,
  # :percentage_and_amount

  def quotation_payments
    object.quotation_payments.map do |quotation_payment|
      QuotationPaymentSerializer.new(quotation_payment).serializable_hash
    end
  end

  def finance_status
    object.is_approved? ? "Approved" : object.is_approved == nil ? "Pending" : "Rejected"
  end

  def finance_verification_timestamp
    object.finance_approved_at&.strftime("%d-%m-%Y %I:%M:%S %p")
  end

  def finance_verification_time
    object.finance_approved_at&.strftime("%I:%M:%S %p")
  end

  def finance_verification_date
    object.finance_approved_at&.strftime("%d-%m-%Y")
  end

end


class PaymentWithProjectDetalsSerializer < PaymentHistorySerializer
  attributes :project, :total_boq_value_of_payment
  def project
    ProjectAmountDetailSerializer.new(object.project).serializable_hash
  end

  def total_boq_value_of_payment
    object.quotations.pluck(:total_amount).compact.sum
  end
end


class PaymentHistoryForBOQ < PaymentSerializer
  attribute :amount_paid_for_boq

  def amount_paid_for_boq
    quotation = @instance_options[:boq_id]
    object.quotation_payments.where(quotation_id: quotation).first.amount.to_f.round(2)
  end
end
