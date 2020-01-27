class AddTypeToWipPo < ActiveRecord::Migration[5.0]
  def change
    add_column :po_wip_orders, :po_type, :string
  end
end
