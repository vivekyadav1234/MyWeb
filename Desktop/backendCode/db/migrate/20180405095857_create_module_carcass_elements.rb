class CreateModuleCarcassElements < ActiveRecord::Migration[5.0]
  def change
    remove_reference :carcass_elements, :product_module, index: true, foreign_key: true
    remove_reference :carcass_elements, :modular_product, index: true, foreign_key: true

    create_table :module_carcass_elements do |t|
      t.references :product_module, index: true, foreign_key: true
      t.references :carcass_element, index: true, foreign_key: true

      t.timestamps
    end
  end
end
