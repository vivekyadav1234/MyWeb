class CreateModuleTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :module_types do |t|
      t.string :name
      t.string :category
      
      t.attachment :module_image

      t.timestamps
    end

    add_reference :product_modules, :module_type, index: true, foreign_key: true
  end
end
