class AddPmFeeColumnToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :service_pm_fee, :float, :null => false, :default => 0
    add_column :quotations, :nonservice_pm_fee, :float, :null => false, :default => 0
  end
end
