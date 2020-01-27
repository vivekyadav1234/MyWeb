class AddDefaultToDesignerProjectCustomerStatus < ActiveRecord::Migration[5.0]
  def change
    change_column_default :designer_projects, :customer_status, "qualified"
  end
end
