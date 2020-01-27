class ChangeRecievdQuantityToFloat < ActiveRecord::Migration[5.0]
  def change
    change_column :po_wip_orders_wip_slis, :recieved_quantity, :float  
  end
end
