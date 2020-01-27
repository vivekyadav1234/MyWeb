class CreateCategoryModuleTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :category_module_types do |t|
      t.references :kitchen_category, index: true, foreign_key: true
      t.references :module_type, index: true, foreign_key: true

      t.timestamps
    end
  end
end
