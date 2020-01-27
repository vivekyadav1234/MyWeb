class AddColumnsToLeadStatisticsDatum < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_statistics_data, :cm_assigned_date, :datetime
    add_column :lead_statistics_data, :boq_shangpin_value, :float, default: 0
    add_column :lead_statistics_data, :closer_shangpin_value, :float, default: 0
  end
end
