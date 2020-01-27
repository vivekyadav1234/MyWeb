class AddColumnsInDispatchSchedule < ActiveRecord::Migration[5.0]
  def self.up
    add_column :dispatch_schedules, :dispached_items, :text
    add_column :dispatch_schedules, :pending_items, :text
  end

  def self.down
    remove_column :dispatch_schedules, :dispached_items
    remove_column :dispatch_schedules, :pending_items
  end

end
