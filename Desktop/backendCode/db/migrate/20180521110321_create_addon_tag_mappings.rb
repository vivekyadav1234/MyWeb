class CreateAddonTagMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :addon_tag_mappings do |t|
      t.references :addon, index: true, foreign_key: true
      t.references :addon_tag, index: true, foreign_key: true

      t.timestamps
    end
  end
end
