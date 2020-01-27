# == Schema Information
#
# Table name: quotations
#
#  id                      :integer          not null, primary key
#  name                    :string
#  terms                   :text
#  net_amount              :float            default(0.0)
#  total_amount            :float            default(0.0)
#  status                  :string           default("0")
#  project_id              :integer
#  user_id                 :integer
#  generation_date         :date
#  expiration_date         :date
#  expiration_in_days      :integer
#  billing_address         :string
#  flat_amount             :float            default(0.0)
#  customer_notes          :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  reference_number        :string
#  presentation_id         :integer
#  designer_id             :integer
#  spaces                  :text             default([]), is an Array
#  spaces_kitchen          :text             default([]), is an Array
#  spaces_loose            :text             default([]), is an Array
#  spaces_services         :text             default([]), is an Array
#  spaces_custom           :text             default([]), is an Array
#  countertop_cost         :float
#  discount_value          :float
#  discount_status         :string
#  disc_status_updated_at  :datetime
#  disc_status_updated_by  :integer
#  final_amount            :float
#  is_approved             :boolean
#  paid_amount             :float
#  wip_status              :string
#  parent_quotation_id     :integer
#  copied                  :boolean
#  per_10_approved_by_id   :integer
#  per_10_approved_at      :datetime
#  per_50_approved_by_id   :integer
#  per_50_approved_at      :datetime
#  category_appoval_by_id  :integer
#  category_appoval_at     :datetime
#  remark                  :text
#  cm_approval_at          :datetime
#  cm_approval_by_id       :integer
#  cm_approval             :boolean
#  category_approval       :boolean
#  sli_flag                :string
#  customer_viewing_option :text             default(["\"boq\""]), is an Array
#  seen_by_category        :boolean          default(FALSE)
#  client_approval_by_id   :integer
#  client_approval_at      :datetime
#  price_increase_factor   :float            default(1.0)
#  estimated_cogs          :float            default(0.0)
#  shangpin_amount         :float            default(0.0)
#  spaces_custom_furniture :string           default([]), is an Array
#  can_edit                :boolean          default(TRUE)
#  duration                :integer
#  payment_50_comp_date    :datetime
#  need_category_approval  :boolean
#  delivery_tnc            :text
#

class QuotationSerializer < ActiveModel::Serializer
  attributes :id, :name, :terms, :net_amount, :total_amount, :status, :generation_date,:remark,
    :expiration_date, :expiration_in_days, :billing_address, :flat_amount, :customer_notes, :created_at,
    :updated_at, :reference_number, :project_id, :user_id, :designer_id, :spaces, :spaces_kitchen,
    :spaces_loose, :spaces_services, :spaces_custom, :spaces_custom_furniture, :countertop_cost, :paid_amount,
    :discount_value,:discount_status,:disc_status_updated_at,:disc_status_updated_by,:final_amount,:is_approved, :wip_status, :copied,
    :per_10_approved_by_id,:per_10_approved_at,:per_50_approved_by_id,:per_50_approved_at, :category_appoval_by_id,
    :category_appoval_at, :cm_approval, :category_approval, :per_100_true, :shangpin_amount, :pm_fee_disabled
  attribute :project_name
  attribute :boq_global_configs
  attribute :modular
  attributes :final_amount, :ten_per_true, :parent_quotation_id, :parent_quotation_reference_no, :per_50_true, :is_have_approved_payments
  attribute :last_payment_status
  attribute :balance_amount
  attribute :pm_fee

  def balance_amount
    object.total_amount - object.paid_amount.to_f
  end

  def cost_price_total
    object.estimated_cogs
  end

  def project_name
    object.project.name
  end

  def pm_fee
    object.total_pm_fee.round(2)
  end

  def boq_global_configs
    object.boq_global_configs.map { |boq_global_config|
      BoqGlobalConfigSerializer.new(boq_global_config).serializable_hash
    }
  end

  def modular
    object.modular_jobs.present?
  end

  # Code has changed since originally written.
  def final_amount
    object.total_amount
  end

  def ten_per_true
    object.paid_amount.to_f > ((0.07)*object.total_amount)
  end

  def per_50_true
    object.paid_amount.to_f > ((0.45)*object.total_amount)
  end

  def per_100_true
    object.payment_100_done?
  end

  def parent_quotation_reference_no
    object.parent_quotation&.reference_number
  end

  def last_payment_status
    (object.quotation_payments&.last&.payment&.present? && object.quotation_payments&.last&.payment&.is_approved == nil) ?  "pending" : object.quotation_payments&.last&.payment&.is_approved
  end

  def is_have_approved_payments
    (object.payments.present?) ? object.payments.pluck(:is_approved).include?(true) : "pending"
  end
end

class QuotationPaymentSerializer < ActiveModel::Serializer
  attributes :boq_id, :boq_name, :boq_terms, :boq_net_amount, :boq_total_amount,
    :boq_status, :boq_generation_date,:boq_remark,
    :boq_expiration_date, :boq_expiration_in_days, :boq_billing_address,
    :boq_flat_amount, :boq_customer_notes, :boq_created_at,
    :boq_updated_at, :boq_reference_number, :boq_project_id, :boq_user_id,
    :boq_designer_id, :boq_spaces, :boq_spaces_kitchen,
    :boq_spaces_loose, :boq_spaces_services, :boq_spaces_custom, :boq_spaces_custom_furniture,
    :boq_countertop_cost, :boq_paid_amount,
    :boq_discount_value,:boq_discount_status,:boq_disc_status_updated_at,:boq_disc_status_updated_by,
    :boq_final_amount,:boq_is_approved, :boq_wip_status, :boq_copied,
    :boq_per_10_approved_by_id,:boq_per_10_approved_at,:boq_per_50_approved_by_id,
    :boq_per_50_approved_at, :boq_category_appoval_by_id,
    :boq_category_appoval_at, :boq_cm_approval, :boq_category_approval,
    :boq_shangpin_amount, :boq_parent_quotation_id,
    :amount

  attributes :project_name,
    :boq_global_configs,
    :modular,
    :last_payment_status,
    :balance_amount,
    :pm_fee, :per_100_true

  attributes :final_amount, :ten_per_true, :parent_quotation_reference_no,
    :per_50_true, :is_have_approved_payments, :approtioned_payment_value

  def approtioned_payment_value
    paid_amount = object.payment.amount
    quotations = object.payment.quotations
    total_quotation_amount = quotations.pluck(:total_amount).sum.to_f
    total_pending_amount = quotations.map{|quotation| quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount}.sum
    quotation = object.quotation
    q_per = ((quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount)/total_pending_amount).to_f
    amount = object.amount.present? ? object.amount : q_per * paid_amount
  end

  def balance_amount
    object.quotation.total_amount - object.quotation.paid_amount.to_f
  end

  def cost_price_total
    object.quotation.estimated_cogs
  end

  def project_name
    object.quotation.project.name
  end

  def pm_fee
    object.quotation.total_pm_fee.round(2)
  end

  def boq_global_configs
    object.quotation.boq_global_configs.map { |boq_global_config|
      BoqGlobalConfigSerializer.new(boq_global_config).serializable_hash
    }
  end

  def modular
    object.quotation.modular_jobs.present?
  end

  # Code has changed since originally written.
  def final_amount
    object.quotation.total_amount
  end

  def ten_per_true
    object.quotation.payment_10_done?
  end

  def per_50_true
    object.quotation.payment_50_done?
  end

  def per_100_true
    object.quotation.payment_100_done?
  end

  def parent_quotation_reference_no
    object.quotation.parent_quotation&.reference_number
  end

  def last_payment_status
    (object.quotation.quotation_payments&.last&.payment&.present? && object.quotation.quotation_payments&.last&.payment&.is_approved == nil) ?  "pending" : object.quotation.quotation_payments&.last&.payment&.is_approved
  end

  def is_have_approved_payments
    (object.quotation.payments.present?) ? object.quotation.payments.pluck(:is_approved).include?(true) : "pending"
  end
end


class PoQuotationSerializer< ActiveModel::Serializer
  attributes :id, :reference_no, :updated_at, :vendor_name

  def vendor_name
    object.vendor&.name
  end
end
