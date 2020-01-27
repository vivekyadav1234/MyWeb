class CreateVendorCategoryMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :vendor_category_mappings do |t|
    	t.references :vendor, index: true
    	t.references :sub_category, index: true, foreign_key: { to_table: 'vendor_categories' }

      t.timestamps
    end
  end
end
