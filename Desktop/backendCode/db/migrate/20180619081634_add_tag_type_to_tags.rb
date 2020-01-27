class AddTagTypeToTags < ActiveRecord::Migration[5.0]
  def change
    add_column :tags, :tag_type, :string
    add_index :tags, :tag_type
  end
end
