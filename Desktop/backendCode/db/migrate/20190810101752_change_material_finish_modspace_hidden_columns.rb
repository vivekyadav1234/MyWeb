class ChangeMaterialFinishModspaceHiddenColumns < ActiveRecord::Migration[5.0]
  def change
    rename_column :core_materials, :modspace_hidden, :modspace_visible
    rename_column :shutter_finishes, :modspace_hidden, :modspace_visible
  end
end
