class CreateCmTagMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :cm_tag_mappings do |t|
      t.references :user
      t.references :tag
      t.timestamps
    end
  end
end
