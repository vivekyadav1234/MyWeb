class AddColumnsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :model_no, :string
    add_column :products, :color, :string
    add_column :products, :finish, :string
    add_column :products, :product_config, :string
    add_column :products, :length, :integer
    add_column :products, :width, :integer
    add_column :products, :height, :integer
    add_column :products, :vendor_sku, :string
    add_column :products, :vendor_name, :string
    add_column :products, :vendor_location, :string
    add_column :products, :cost_price, :float
    add_column :products, :model3d_file, :string
    add_column :products, :manufacturing_time_days, :integer
    rename_column :products, :price, :sale_price
    remove_column :products, :description, :text
  end
end
