class AddColumnsToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :product_url, :string
    add_column :products, :material, :text
    add_column :products, :dimension_remark, :text
    add_column :products, :warranty, :string
    add_column :products, :remark, :text
    add_column :products, :measurement_unit, :string
    add_column :products, :lead_time, :string
    add_column :products, :qty, :integer
  end
end
