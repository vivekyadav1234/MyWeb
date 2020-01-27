class AddQuantityToModuleElmentMappings < ActiveRecord::Migration[5.0]
  def change
    add_column :module_carcass_elements, :quantity, :integer
    add_column :module_hardware_elements, :quantity, :integer
  end
end
