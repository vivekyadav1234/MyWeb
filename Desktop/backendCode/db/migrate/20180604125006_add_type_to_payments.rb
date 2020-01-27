class AddTypeToPayments < ActiveRecord::Migration[5.0]
  def change
    add_column :payments, :payment_stage, :string
  end
end
