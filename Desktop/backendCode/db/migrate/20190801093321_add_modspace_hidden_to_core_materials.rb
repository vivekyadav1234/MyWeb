class AddModspaceHiddenToCoreMaterials < ActiveRecord::Migration[5.0]
  def change
    add_column :core_materials, :modspace_hidden, :boolean, null: false, default: false
  end
end
