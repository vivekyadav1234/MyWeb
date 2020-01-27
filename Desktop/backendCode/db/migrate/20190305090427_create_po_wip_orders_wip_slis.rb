class CreatePoWipOrdersWipSlis < ActiveRecord::Migration[5.0]
  def change
    create_table :po_wip_orders_wip_slis do |t|
      t.references :wip_sli, foreign_key: true
      t.references :po_wip_order, foreign_key: true
      t.integer :quantity
      t.integer :recieved_quantity, default: 0
      t.datetime :recieved_at
      t.integer :parent_wip_sli_id, index: true, foreign_key: {to_table: :po_wip_orders_wip_slis}
      t.timestamps
    end
  end
end
