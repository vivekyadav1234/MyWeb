class AddDispatchedByToDispatchSchedule < ActiveRecord::Migration[5.0]
  def self.up
    add_column :dispatch_schedules, :dispatched_by, :text
  end

  def self.down
    remove_column :dispatch_schedules, :dispatched_by
  end
end
