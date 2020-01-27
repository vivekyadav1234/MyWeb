class RenameScheduleDataTimeInEvents < ActiveRecord::Migration[5.0]
  def change
    rename_column :events, :schedule_data_time, :scheduled_at
  end
end
