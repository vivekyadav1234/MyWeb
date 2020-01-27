class AddAddonCombinationIdToProductModuleAddons < ActiveRecord::Migration[5.0]
  def change
    add_reference :product_module_addons, :addon_combination, index: true, foreign_key: true
  end
end
