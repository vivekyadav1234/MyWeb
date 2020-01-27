class AddPaidAmountToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :paid_amount, :float
  end
end
