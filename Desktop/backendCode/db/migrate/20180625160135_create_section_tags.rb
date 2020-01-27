class CreateSectionTags < ActiveRecord::Migration[5.0]
  def change
    create_table :section_tags do |t|
      t.references :section, index: true, foreign_key: true
      t.references :tag, index: true, foreign_key: true

      t.timestamps
    end
  end
end
