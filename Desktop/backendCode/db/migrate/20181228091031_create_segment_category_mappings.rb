class CreateSegmentCategoryMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :segment_category_mappings do |t|
      t.references :catalog_segment, index: true, foreign_key: true
      t.references :catalog_category, index: true, foreign_key: true

      t.timestamps
    end
  end
end
