class AddModspaceHiddenToShutterFinishes < ActiveRecord::Migration[5.0]
  def change
    add_column :shutter_finishes, :modspace_hidden, :boolean, null: false, default: false
  end
end
