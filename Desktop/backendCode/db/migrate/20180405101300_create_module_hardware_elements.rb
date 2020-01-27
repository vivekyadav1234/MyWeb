class CreateModuleHardwareElements < ActiveRecord::Migration[5.0]
  def change
    remove_reference :hardware_elements, :product_module, index: true, foreign_key: true
    remove_reference :hardware_elements, :modular_product, index: true, foreign_key: true

    create_table :module_hardware_elements do |t|
      t.references :product_module, index: true, foreign_key: true
      t.references :hardware_element, index: true, foreign_key: true

      t.timestamps
    end
  end
end
