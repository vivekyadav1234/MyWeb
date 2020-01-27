class CreatePoInventories < ActiveRecord::Migration[5.0]
  def change
    create_table :po_inventories do |t|
      t.references :vendor_product, foreign_key: true
      t.integer :quantity
      t.datetime :lats_ordered

      t.timestamps
    end
  end
end
