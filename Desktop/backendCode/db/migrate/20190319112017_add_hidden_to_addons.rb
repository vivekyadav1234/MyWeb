class AddHiddenToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :hidden, :boolean, null: false, default: false
    remove_column :addons, :reduce_channel_cost, :boolean, null: false, default: false
  end
end
