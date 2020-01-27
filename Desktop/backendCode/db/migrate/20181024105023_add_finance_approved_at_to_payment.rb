class AddFinanceApprovedAtToPayment < ActiveRecord::Migration[5.0]
  def change
    add_column :payments, :finance_approved_at, :datetime
  end
end
