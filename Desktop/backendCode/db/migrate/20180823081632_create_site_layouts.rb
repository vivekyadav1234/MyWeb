class CreateSiteLayouts < ActiveRecord::Migration[5.0]
  def change
    create_table :site_layouts do |t|
      t.references :note_record, foreign_key: true
      t.attachment :layout_image
      t.timestamps
    end
  end
end
