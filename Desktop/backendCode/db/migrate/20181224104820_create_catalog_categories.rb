class CreateCatalogCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :catalog_categories do |t|
      t.string :category_name, null: false

      t.timestamps
    end

    add_index :catalog_categories, :category_name, unique: true
  end
end
