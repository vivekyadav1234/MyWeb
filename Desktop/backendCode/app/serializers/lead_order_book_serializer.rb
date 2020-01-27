class LeadOrderBookSerializer < ActiveModel::Serializer
  attributes :id, :name
  attribute :project_name
  attribute :project_name
  attribute :boq_value
  attribute :discount
  attribute :estimated_cogs
  attribute :actual_cogs
  attribute :estimated_margin
  attribute :actual_margin
  attribute :cash_collected
  attribute :payment_to_vendors

  def initialize(*args)
    super
    @project = object.project
    @quotations = @project.quotations
    @purchase_orders = @project.purchase_orders
    @boq_value_variable = nil
    @estimated_cogs_value = nil
    @actual_cogs_value = nil
  end

  def project_name
    @project.name
  end

  # Take the last shared proposal.
  def boq_value
    shared_proposal = @project.proposals.where(proposal_status: "proposal_shared").last
    @boq_value_variable = @quotations.joins(:proposals).where(proposals: {id: shared_proposal}).distinct.average(:total_amount).to_i
  end

  def discount
    shared_proposal = @project.proposals.where(proposal_status: "proposal_shared").last
    discount_array = @quotations.joins(:proposals).where(proposals: {id: shared_proposal}).distinct.map{|q| q.discount_value.to_f}
    if discount_array.count == 0
      return 0
    else
      ((discount_array.sum)/discount_array.count).round(1)
    end
  end

  def estimated_cogs
    shared_proposal = @project.proposals.where(proposal_status: "proposal_shared").last
    @estimated_cogs_value = @quotations.joins(:proposals).where(proposals: {id: shared_proposal}).distinct.average(:estimated_cogs).to_i
  end

  # exclude cancelled POs.
  def actual_cogs
    @actual_cogs_value = JobElementVendor.joins(purchase_elements: :purchase_order).where(purchase_orders: {id: @purchase_orders.where.not(status: "cancelled")}).distinct.sum(:final_amount).to_i
    if @actual_cogs_value > 0
      return @actual_cogs_value
    else
      "NA"
    end
  end

  def estimated_margin
    unless @boq_value_variable.to_f > 0
      return "NA"
    else
      var = 100 * (@boq_value_variable - @estimated_cogs_value - 0.07 * @boq_value_variable)/@boq_value_variable.to_f
      var.round(0)
    end
  end

  def actual_margin
    unless @boq_value_variable.to_f > 0 && @actual_cogs_value.to_f > 0
      return "NA"
    else
      (100 * (@boq_value_variable - @actual_cogs_value)/@boq_value_variable.to_f).round(1)
    end
  end

  def cash_collected
    @project.payments.sum(:amount)
  end

  def payment_to_vendors
    return "NA"   #Temporary as code has changed and we need to fix this bug quickly - Arunoday.
    # PerformaInvoice.joins(:purchase_orders).where(purchase_orders: {id: @purchase_orders.where.not(status: "cancelled")}).distinct.sum(:amount).to_i
  end
end
