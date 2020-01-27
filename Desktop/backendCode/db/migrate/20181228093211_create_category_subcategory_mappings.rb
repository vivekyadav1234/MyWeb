class CreateCategorySubcategoryMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :category_subcategory_mappings do |t|
      t.references :catalog_category, index: true, foreign_key: true
      t.references :catalog_subcategory, index: true, foreign_key: true

      t.timestamps
    end
  end
end
