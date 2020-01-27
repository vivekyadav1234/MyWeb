class AddMovementToPurchaseOrder < ActiveRecord::Migration[5.0]
  def change
    add_column :purchase_orders, :movement, :string
  end
end
