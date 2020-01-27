# == Schema Information
#
# Table name: proposals
#
#  id              :integer          not null, primary key
#  proposal_type   :string
#  proposal_name   :string
#  project_id      :integer
#  designer_id     :integer
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  proposal_status :string
#  is_draft        :string
#

class ProposalSerializer < ActiveModel::Serializer
  attributes :id, :proposal_type, :proposal_name, :designer_id, :proposal_status, :sent_at, :proposed_quotations, :proposesd_presentations,
  :proposesd_uploaded_presentations, :created_at, :updated_at, :is_draft, :final_proposal_can_share,
  :site_measurement_status
  has_one :project

  def created_at
    object.created_at.strftime("%d-%m-%Y")
  end

  def site_measurement_status
    object.project&.site_measurement_requests&.pluck(:request_status)&.include?("complete")
  end

  def final_proposal_can_share
    # quotations = object.quotations
    # quotations.pluck(:cm_approval).include?(true) && quotations.pluck(:category_approval).include?(true)
    # quotations.present?
    object.proposal_status == 'pending'
  end

  def proposed_quotations
  	@proposed_boqs = object.proposal_docs.where(ownerable_type: "Quotation")
  	array = []
  	@proposed_boqs.each do |proposal_doc|
  	  hash = Hash.new
  	  hash[:proposed_doc_id] = proposal_doc.id
      hash[:discount_value] = proposal_doc.discount_value
  	  hash[:discount_status] = proposal_doc.discount_status
  	  hash[:is_approved] = proposal_doc.is_approved
      hash[:remark] = proposal_doc.remark
     #  hash[:is_discount_cm_approved] = proposal_doc.ownerable.approvals.where(role: ['business_head', 'community_manager', 'city_gm']).present?
     #  hash[:is_discount_gm_approved] = proposal_doc.ownerable.approvals.where(role: ['business_head','city_gm']).present?
  	  # hash[:is_discount_bh_approved] = proposal_doc.ownerable.approvals.where(role: ['business_head']).present?
      hash[:quotation] = proposal_doc.ownerable.attributes.merge("pm_fee": proposal_doc.ownerable.total_pm_fee.round(2))
      hash[:cad_file_uploaded] = proposal_doc.ownerable.cad_uploads.present?
      hash[:have_approved_cad_files] = proposal_doc.ownerable&.cad_uploads&.where(status: "approved").present?
      hash[:final_amount] = (proposal_doc.discount_status == "approved" && proposal_doc.discount_value.present?) ? (proposal_doc.ownerable.total_amount - (proposal_doc.ownerable.total_amount*(proposal_doc.discount_value/100))) :  proposal_doc.ownerable.total_amount
      hash[:customer_status] = proposal_doc.is_approved.nil? ? "Pending" : proposal_doc.is_approved ? "Approved" :  proposal_doc.customer_remark.present? ? "Rejected (#{proposal_doc.customer_remark})" : "Rejected"
  	  array.push(hash)
  	end
  	array
  end

  def proposesd_presentations
  	@proposed_boqs = object.proposal_docs.where(ownerable_type: "Presentation")
  	array = []
  	@proposed_boqs.each do |proposal_doc|
  	  hash = Hash.new
  	  hash[:proposed_doc_id] = proposal_doc.id
  	  hash[:discount_value] = proposal_doc.discount_value
  	  hash[:is_approved] = proposal_doc.is_approved
  	  hash[:presentation] = proposal_doc.ownerable.attributes
  	  array.push(hash)
  	end
  	array
  end

  def proposesd_uploaded_presentations
    @proposed_boqs = object.proposal_docs.where(ownerable_type: "BoqAndPptUpload")
    array = []
    @proposed_boqs.each do |proposal_doc|
      hash = Hash.new
      hash[:proposed_doc_id] = proposal_doc.id
      hash[:uploaded_presentation] = proposal_doc.ownerable.attributes
      array.push(hash)
    end
    array
  end
end


class ProposalSerializerForFinance < ProposalSerializer
  attribute :total_proposal_amount

  def total_proposal_amount
    object.quotations.pluck(:total_amount).compact.sum
  end
end
