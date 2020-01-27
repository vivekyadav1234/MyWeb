class ClientQuotationSerializer
	include FastJsonapi::ObjectSerializer
	attributes :id, :reference_number

	def serializable_hash
    	data = super
    	data[:data]
  end
  
  attribute :finalize_design_present do |object|
  	final_proposal_present(object.child_quotations&.ids).present?
  end

  attribute :is_approved do |object|
  	if final_proposal_present(object.child_quotations&.last&.id).present?
  		object.child_quotations&.last&.is_approved
  	else
  		object.is_approved
  	end
  end

  attribute :production_kickoff do |object|
  	false
  end

  attribute :last_mile do |object|
  	false
  end
 
  def self.final_proposal_present(quotation_ids)
  	Proposal.joins(:quotations).where(proposal_type: "final_design", quotations: {id: quotation_ids, status: "shared"}) # removed cm approval
  end
end

class ClientQuotationBookOrderSerializer
	include FastJsonapi::ObjectSerializer
	attributes :id, :reference_number, :is_approved

	attributes :proposed_ppts do |object|
		proposal_id = object.proposals&.ids
		ppts = Presentation.joins(:proposals).select(:id, :title).where(proposals: {id: proposal_id})&.as_json
	end
  attributes :proposed_uploaded_ppts do |object|
    proposal_id = object.proposals&.ids
    ppts = BoqAndPptUpload.joins(:proposals).where(proposals: {id: proposal_id})
    FjsBoqAndPptUploadSerializer.new(ppts).serializable_hash
  end

	attributes :ten_per_true do |object|
		object.paid_amount.to_f > (0.07*object.total_amount).to_f
	end
end

class ClientFinalQuotationSerializer
include FastJsonapi::ObjectSerializer
  attributes :id, :reference_number, :is_approved

  attribute :site_measurment do |object|
    object.project&.site_measurement_requests&.pluck(:request_status)&.include?("complete")
  end

  attributes :proposed_ppts do |object|
    proposal_id = object.proposals&.ids
    ppts = Presentation.joins(:proposals).select(:id, :title).where(proposals: {id: proposal_id})&.as_json
  end
  
  attributes :proposed_uploaded_ppts do |object|
    proposal_id = object.proposals&.ids
    ppts = BoqAndPptUpload.joins(:proposals).where(proposals: {id: proposal_id})
    FjsBoqAndPptUploadSerializer.new(ppts).serializable_hash
  end

  attributes :fifty_per_true do |object|
    object.paid_amount.to_f >= (0.45*object.total_amount).to_f
  end
end