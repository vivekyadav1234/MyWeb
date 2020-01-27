class AddShareAndClosureValuesToLeadStatisticsData < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_statistics_data, :first_shared_value, :float, null:false, default: 0
    add_column :lead_statistics_data, :closure_value, :float, null:false, default: 0
  end
end
