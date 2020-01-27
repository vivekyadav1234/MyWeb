class RemoveMasterFromModularTables < ActiveRecord::Migration[5.0]
  def change
    remove_reference :product_modules, :master_module, index: true, foreign_key: { to_table: :product_modules}
    remove_reference :carcass_elements, :master_carcass_element, index: true, foreign_key: { to_table: :carcass_elements}
    remove_reference :hardware_elements, :master_hardware_element, index: true, foreign_key: { to_table: :hardware_elements}
    remove_reference :addons, :master_addon, index: true, foreign_key: { to_table: :addons}
    remove_reference :handles, :master_handle, index: true, foreign_key: { to_table: :handles}
  end
end
