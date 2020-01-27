class AddDurationAndPaymentToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :duration, :integer
    add_column :quotations, :payment_50_comp_date, :datetime
  end
end
