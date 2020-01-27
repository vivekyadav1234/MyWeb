class CreateVendorProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :vendor_products do |t|
      t.string :sli_code
      t.string :sli_name
      t.string :vendor_code
      t.string :unit
      t.float :rate

      t.references :vendor, index: true, foreign_key: true
      t.references :master_line_item, index: true, foreign_key: true

      t.timestamps
    end

    add_index :vendor_products, [:vendor_id, :sli_code], unique: true, name: 'by_branch_and_sli_code'
  end
end
