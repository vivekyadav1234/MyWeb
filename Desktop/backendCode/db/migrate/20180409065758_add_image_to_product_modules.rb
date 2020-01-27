class AddImageToProductModules < ActiveRecord::Migration[5.0]
  def change
    add_attachment :product_modules, :module_image
    remove_attachment :module_types, :module_image
  end
end
