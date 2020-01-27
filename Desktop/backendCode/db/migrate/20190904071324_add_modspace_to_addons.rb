class AddModspaceToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :modspace, :boolean, null: false, default: false
  end
end
