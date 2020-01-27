class AddTransactionNumberToPiPayment < ActiveRecord::Migration[5.0]
  def change
    add_column :pi_payments, :transaction_number, :string
  end
end
