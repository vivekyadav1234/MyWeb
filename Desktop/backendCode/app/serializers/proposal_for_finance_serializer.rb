class ProposalForFinanceSerializer < ActiveModel::Serializer 
  attributes :id, :proposal_type, :proposal_name, :proposal_status, :payment_varified, :count_files, :created_at,
  :payment_details
  
  def count_files
  	object.proposal_docs.where(is_approved: "yes").count
  end

  def payment_varified
  	@payments = object.project.payments.where(payment_status: "done",is_approved: "no")
  	if @payments.present?
     true
  	else
     false  	
  	end
  end

  def payment_details
    @payments = object.project.payments
    hash = Hash.new
    if @payments.present?
    hash[:total_amount] = @payments.last.total_amount
    hash[:paid_amount] = @payments.sum(:amount)
    hash[:balance] = hash[:total_amount] - hash[:paid_amount]
  end
    hash
  end

end