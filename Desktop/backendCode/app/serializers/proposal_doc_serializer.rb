# == Schema Information
#
# Table name: proposal_docs
#
#  id                     :integer          not null, primary key
#  proposal_id            :integer
#  ownerable_type         :string
#  ownerable_id           :integer
#  is_approved            :boolean
#  approved_at            :datetime
#  discount_value         :float
#  disc_status_updated_by :integer
#  disc_status_updated_at :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  discount_status        :string
#  remark                 :text
#  seen_by_category       :boolean          default(FALSE)
#  customer_remark        :text
#

class ProposalDocSerializer < ActiveModel::Serializer
  attributes :id, :proposal_name, :proposal_id, :discount_value, :discount_status, :is_approved , :quotation, :final_amount, :remark , :created_at, :updated_at, :payment_varified,
    :payment_details,:proposal_type, :cad_file_uploaded, :have_approved_cad_files, :customer_status

  def cad_file_uploaded
    object.ownerable&.cad_uploads.present?
  end

  def have_approved_cad_files
    object.ownerable&.cad_uploads&.where(status: "approved").present?
  end

  def proposal_name
    object.proposal.proposal_name
  end

  def proposal_id
    object.proposal.id
  end

  def proposal_type
    object.proposal.proposal_type
  end

  def quotation
    QuotationSerializer.new(object.ownerable).serializable_hash
  end

  def final_amount
    object.discount_value.present? ? object.ownerable.total_amount - object.ownerable.total_amount*(object.discount_value/100) :  object.ownerable.total_amount
  end

  def payment_varified
    @payments = object.ownerable.payments.where(payment_status: "done",is_approved: "no")
    if @payments.present?
     true
    else
     false
    end
  end

   def payment_details
    @payments = object.ownerable.payments
    hash = Hash.new
    if @payments.present?
    # hash[:total_amount] = @payments.last.total_amount
    # hash[:paid_amount] = @payments.sum(:amount)
    # hash[:balance] = hash[:total_amount] - hash[:paid_amount]
    end
    hash
  end

  def customer_status
    object.is_approved.nil? ? "Pending" : object.is_approved ? "Approved" : object.customer_remark.present? ? "Rejected (#{object.customer_remark})" : "Rejected"
  end
end


class ProposalDocCategorySerializer < ActiveModel::Serializer

  attributes :id, :proposal_name, :proposal_id, :discount_value, :discount_status, :is_approved , :remark , :created_at, :updated_at,
    :proposal_type, :lead_id, :ownerable_id, :ownerable_type, :due_date, :assigned_designer, :assigned_cm, :new, :client_name, :boq_reference_no,
    :tat, :project_id, :category_approval, :cad_uploads_pending

  def created_at
    object.created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def proposal_name
    object.proposal.proposal_name
  end

  def proposal_id
    object.proposal.id
  end

  def proposal_type
    object.proposal.proposal_type
  end

  def lead_id
    object.ownerable.project.lead_id
  end

  def due_date
    (object.created_at + 48.hours).strftime("%e %b %Y %H:%M:%S%p")
  end

  def assigned_designer
    object.proposal.project.assigned_designer.name.titleize
  end

  def assigned_cm
    object.proposal.project.assigned_designer.cm.name.titleize
  end

  def new
    object.ownerable.seen_by_category == true ? false : true
  end

  def client_name
    object.ownerable.user.name
  end

  def boq_reference_no
    object.ownerable.reference_number
  end

  def tat
    (((object.created_at + 48.hours) - Time.zone.now)/3600).round
  end

  def project_id
    object.ownerable.project.id
  end

  def category_approval
    object.ownerable.category_approval
  end

  def cad_uploads_pending
    object.ownerable.cad_uploads&.pluck(:status).include?("pending") ? true : false
  end

end
