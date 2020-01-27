class ProjectSerializerForFinance < ActiveModel::Serializer
  attributes :id, :name, :created_at, :status, :sub_status, :designer, :cm , :user, :payment_details, :payment_varified

  def designer
  	object.assigned_designer.slice(:id,:name,:email)
  end

  def cm
  	object.assigned_designer.cm.slice(:id,:name,:email)
  end

  def user
  	object.user.slice(:id,:name,:email)
  end

  def payment_details
  	payments = object.payments
  	hash = Hash.new
  	if payments.present?
	    hash[:total_amount] = object.quotations.where(is_approved: true).sum(:total_amount)
	    hash[:paid_amount] = payments.sum(:amount)
	    hash[:balance] = hash[:total_amount].to_f - hash[:paid_amount].to_f
	  end
    hash
  end

  def payment_varified
  	@payments = object.payments.where(payment_status: "done",is_approved: "no")
  	if @payments.present?
     true
  	else
     false
  	end
  end

end
