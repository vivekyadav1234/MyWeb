class AddPriorityNumberIndexToLeadPriorities < ActiveRecord::Migration[5.0]
  def change
    add_index :lead_priorities, :priority_number, unique: true
  end
end
