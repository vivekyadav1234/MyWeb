class CreateWipSlis < ActiveRecord::Migration[5.0]
  def change
    create_table :wip_slis do |t|
      t.integer :quantity
      t.string :tax_type
      t.float :tax
      t.float :amount
      t.references :vendor_product, foreign_key: true
      t.timestamps
    end
  end
end
