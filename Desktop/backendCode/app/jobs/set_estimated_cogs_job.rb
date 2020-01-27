# This job will set the costs for the BOQ (and its line items, inluding setting the ModularJobCost values)
# This job should be called only when BOQ amount is being changed, otherwise we can lose historical cost data (as prices, factors
# and even logic might change with time).
class SetEstimatedCogsJob < ApplicationJob
  queue_as :analytics

  def perform(boq_id)
    # Do something later
    boq = Quotation.find_by_id(boq_id)
    boq.set_estimated_cogs
  end
end
