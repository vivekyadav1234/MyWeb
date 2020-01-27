class RemoveModuleFromModularTables < ActiveRecord::Migration[5.0]
  def change
    # remove_reference :carcass_elements, :product_module, index: true, foreign_key: true
    # remove_reference :carcass_elements, :modular_product, index: true, foreign_key: true
    # remove_reference :hardware_elements, :product_module, index: true, foreign_key: true
    # remove_reference :hardware_elements, :modular_product, index: true, foreign_key: true
    remove_reference :handles, :product_module, index: true, foreign_key: true
    remove_reference :handles, :modular_product, index: true, foreign_key: true
    remove_reference :addons, :product_module, index: true, foreign_key: true
    remove_reference :addons, :modular_product, index: true, foreign_key: true
    remove_reference :custom_elements, :product_module, index: true, foreign_key: true
  end
end
