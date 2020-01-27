class AddBoqCreationColumnsToLeadStatisticsData < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_statistics_data, :boq_creation_time, :datetime
    add_column :lead_statistics_data, :boq_creation_value, :float, null: false, default: 0.0
  end
end
