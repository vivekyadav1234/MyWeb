class AddMasterChildRelationToMkw < ActiveRecord::Migration[5.0]
  def change
    add_reference :product_modules, :master_module, index: true, foreign_key: {to_table: :product_modules}
    add_reference :carcass_elements, :master_carcass_element, index: true, foreign_key: {to_table: :carcass_elements}
    add_reference :hardware_elements, :master_hardware_element, index: true, foreign_key: {to_table: :hardware_elements}
    add_reference :handles, :master_handle, index: true, foreign_key: {to_table: :handles}
    add_reference :addons, :master_addon, index: true, foreign_key: {to_table: :addons}
  end
end
