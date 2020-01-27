class AddDesignerDataToLeadStattistics < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_statistics_data, :designer_assign_time, :datetime
    add_column :lead_statistics_data, :designer_first_call, :datetime
  end
end
