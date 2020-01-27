class AddCustomerStatusColumnsToDesignerUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :designer_projects, :customer_status, :string
    add_column :designer_projects, :customer_meeting_time, :datetime
    add_column :designer_projects, :customer_remarks, :string
  end
end
