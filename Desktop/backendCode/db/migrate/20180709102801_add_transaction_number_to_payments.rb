class AddTransactionNumberToPayments < ActiveRecord::Migration[5.0]
  def change
  	add_column :payments, :transaction_number, :string
  end
end
