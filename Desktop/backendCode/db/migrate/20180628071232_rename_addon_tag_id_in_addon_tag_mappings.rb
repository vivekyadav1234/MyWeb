class RenameAddonTagIdInAddonTagMappings < ActiveRecord::Migration[5.0]
  def change
    rename_column :addon_tag_mappings, :addon_tag_id, :tag_id
  end
end
