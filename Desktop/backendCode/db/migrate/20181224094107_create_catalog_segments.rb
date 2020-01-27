class CreateCatalogSegments < ActiveRecord::Migration[5.0]
  def change
    create_table :catalog_segments do |t|
      t.string :segment_name, null: false

      t.timestamps
    end

    add_index :catalog_segments, :segment_name, unique: true
  end
end
