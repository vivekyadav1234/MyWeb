class AddUniqueIndexesToModularTables < ActiveRecord::Migration[5.0]
  def change
    add_index :product_modules, :code, unique: true
    add_index :carcass_elements, :code, unique: true
    add_index :hardware_elements, [:code, :brand_id], unique: true
    add_index :addons, :code, unique: true
    add_index :shades, :code, unique: true
    
    add_index :brands, :name, unique: true
    add_index :carcass_element_types, :name, unique: true
    add_index :core_materials, :name, unique: true
    add_index :hardware_element_types, :name, unique: true
    add_index :hardware_types, :name, unique: true
    add_index :kitchen_categories, :name, unique: true
    add_index :module_types, :name, unique: true
    add_index :shutter_finishes, :name, unique: true

    add_index :category_module_types, [:kitchen_category_id, :module_type_id], unique: true, name: 'index_category_module_types_on_category_and_module_type'
    add_index :core_material_prices, [:thickness, :core_material_id], unique: true
    add_index :kitchen_module_addon_mappings, [:name, :product_module_id], unique: true, name: 'index_kitchen_module_addon_on_name_and_product_module'
    add_index :module_carcass_elements, [:carcass_element_id, :product_module_id], unique: true, name: 'index_module_carcass_elements_on_carcass_element_and_module'
    add_index :module_hardware_elements, [:hardware_element_id, :product_module_id], unique: true, name: 'index_module_hardware_elements_on_hardware_element_and_module'  
    add_index :product_module_addons, [:product_module_id, :addon_id], unique: true
    add_index :product_module_types, [:product_module_id, :module_type_id], unique: true, name: 'index_product_module_types_on_module_and_module_type' 
    add_index :shutter_finish_shades, [:shutter_finish_id, :shade_id], unique: true
    add_index :shutter_material_finishes, [:core_material_id, :shutter_finish_id], unique: true, name: 'index_shutter_material_finishes_on_material_and_shutter'
    add_index :skirting_configs, [:skirting_type, :skirting_height], unique: true
  end
end
