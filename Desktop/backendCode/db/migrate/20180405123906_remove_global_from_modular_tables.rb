class RemoveGlobalFromModularTables < ActiveRecord::Migration[5.0]
  def change
    remove_column :product_modules, :global, :boolean
    remove_column :carcass_elements, :global, :boolean
    remove_column :hardware_elements, :global, :boolean
    remove_column :addons, :global, :boolean
    remove_column :handles, :global, :boolean
    remove_column :custom_elements, :global, :boolean

    remove_column :carcass_elements, :quantity, :integer
    remove_column :hardware_elements, :quantity, :integer
    remove_column :addons, :quantity, :integer
    remove_column :handles, :quantity, :integer
  end
end
