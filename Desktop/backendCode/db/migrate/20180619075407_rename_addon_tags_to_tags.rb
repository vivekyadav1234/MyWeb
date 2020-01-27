class RenameAddonTagsToTags < ActiveRecord::Migration[5.0]
  def change
    rename_table :addon_tags, :tags
  end
end
