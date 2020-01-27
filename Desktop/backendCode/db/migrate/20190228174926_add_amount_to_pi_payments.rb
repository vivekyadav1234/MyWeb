class AddAmountToPiPayments < ActiveRecord::Migration[5.0]
  def change
    add_column :pi_payments, :amount, :float
  end
end
