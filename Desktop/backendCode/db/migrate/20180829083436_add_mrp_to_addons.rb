class AddMrpToAddons < ActiveRecord::Migration[5.0]
  def change
  	add_column :addons, :mrp, :float
  end
end
