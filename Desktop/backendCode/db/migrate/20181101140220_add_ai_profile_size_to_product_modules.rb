class AddAiProfileSizeToProductModules < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :al_profile_size, :float, default: 0.0
  end
end
