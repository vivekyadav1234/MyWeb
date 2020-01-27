class AddExtraToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :extra, :boolean, default: false
  end
end
