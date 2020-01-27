class AddRemarksToPayment < ActiveRecord::Migration[5.0]
  def change
    add_column :payments, :remarks, :string
  end
end
