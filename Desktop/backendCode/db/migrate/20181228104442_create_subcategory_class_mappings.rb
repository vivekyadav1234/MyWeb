class CreateSubcategoryClassMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :subcategory_class_mappings do |t|
      t.references :catalog_subcategory, index: true, foreign_key: true
      t.references :catalog_class, index: true, foreign_key: true

      t.timestamps
    end
  end
end
