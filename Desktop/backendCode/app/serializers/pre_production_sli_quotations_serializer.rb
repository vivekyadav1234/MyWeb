# object class is Quotation
class PreProductionSliQuotationsSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper

  attributes :id, :name, :created_at, :reference_number, :sli_flag, :project_id
  attribute :designer_details
  attribute :cm_details
  attribute :lead_details
  attribute :unseen
  attribute :tat
  attribute :time_left
  attribute :sli_count
  attribute :total_payment_percentage
  attribute :date_of_last_50_percent_payment
  attribute :project_address

  def initialize(*args)
    super
    @project = object.project
  end

  def designer_details
    @project.assigned_designer&.attributes&.slice('id', 'name', 'email')
  end

  def cm_details
    @project.lead.assigned_cm&.attributes&.slice('id', 'name', 'email')
  end

  def lead_details
    @project.lead&.attributes&.slice('id', 'name', 'email')
  end

  def unseen
    !object.sli_creation_task&.seen
  end

  def tat
    object.sli_creation_task&.end_time
  end

  def time_left
    end_time = object.sli_creation_task&.end_time
    if end_time.present?
      str = time_ago_in_words(end_time)
      str << " ago" if Time.zone.now > end_time
      return str
    else
      return nil
    end
  end

  def sli_count
    object.job_elements.count
  end

  # def total_payment_percentage
  #   total_amount = object.total_amount
  #   payments = object.payments
  #   total_amount_received = payments.map(&:amount).inject(0,:+)
  #   if total_amount.present? and total_amount_received.present?
  #     return ((total_amount_received/total_amount)*100).round(2)
  #   else
  #     return nil
  #   end
  # end

  def total_payment_percentage
    total_amount_paid = object.paid_amount.to_f
    total_amount = object.total_amount
    if total_amount.present? and total_amount_paid.present?
      return ((total_amount_paid/total_amount)*100).round(2)
    else
      return nil
    end
  end

  # def date_of_last_50_percent_payment
  #   payments = object.payments.where(payment_stage: "10_50_percent")&.last&.finance_approved_at&.strftime("%Y-%m-%d:%I:%M:%S%p")
  # end

  def date_of_last_50_percent_payment
    payment_percentage = total_payment_percentage
    if payment_percentage.present? #and (payment_percentage >= 50.0)
      last_payment = object.payments&.last
      unless last_payment.present?
        last_payment = object.parent_quotation&.payments&.last
      end
      if last_payment&.finance_approved_at.present?
        return last_payment&.finance_approved_at&.strftime("%Y-%m-%d")
      else
        return last_payment&.updated_at&.strftime("%Y-%m-%d")
      end
    end
  end

  def project_address
    @project.project_address
  end
end
