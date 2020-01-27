class AddUnitsSoldToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :units_sold, :integer, default: 0
  end
end
