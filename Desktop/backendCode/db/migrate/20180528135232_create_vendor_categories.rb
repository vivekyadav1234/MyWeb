class CreateVendorCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :vendor_categories do |t|
      t.string :category_name
      t.references :parent_category, index: true, foreign_key: { to_table: 'vendor_categories' }

      t.timestamps
    end
  end
end
