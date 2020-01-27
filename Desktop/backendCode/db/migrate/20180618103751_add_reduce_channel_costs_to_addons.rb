class AddReduceChannelCostsToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :reduce_channel_cost, :boolean, default: false
  end
end
