class AddPmFeeDisabledToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :pm_fee_disabled, :boolean, default: false, null: false
  end
end
