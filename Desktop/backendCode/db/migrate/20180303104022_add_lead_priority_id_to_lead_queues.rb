class AddLeadPriorityIdToLeadQueues < ActiveRecord::Migration[5.0]
  def change
    add_reference :lead_queues, :lead_priority, index: true, foreign_key: true
  end
end
