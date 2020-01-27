class CreateCatalogSubcategories < ActiveRecord::Migration[5.0]
  def change
    create_table :catalog_subcategories do |t|
      t.string :subcategory_name, null: false

      t.timestamps
    end

    add_index :catalog_subcategories, :subcategory_name, unique: true
  end
end
