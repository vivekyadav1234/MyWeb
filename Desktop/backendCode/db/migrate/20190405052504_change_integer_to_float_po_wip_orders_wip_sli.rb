class ChangeIntegerToFloatPoWipOrdersWipSli < ActiveRecord::Migration[5.0]
  def change
    change_column :po_wip_orders_wip_slis, :quantity, :float
  end
end
