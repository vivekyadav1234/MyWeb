class AddHiddenToShadesAndProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :shades, :hidden, :boolean, default: false
    add_column :products, :hidden, :boolean, default: false
  end
end
