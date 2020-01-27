class ChangeQuotationStatusToString < ActiveRecord::Migration[5.0]
  def change
    change_column :quotations, :status, :string
  end
end
