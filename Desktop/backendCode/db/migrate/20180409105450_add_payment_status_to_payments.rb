class AddPaymentStatusToPayments < ActiveRecord::Migration[5.0]
  def change
    add_column :payments, :payment_status, :string
  end
end
