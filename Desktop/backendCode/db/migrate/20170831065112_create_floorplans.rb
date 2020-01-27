class CreateFloorplans < ActiveRecord::Migration[5.0]
  def change
    create_table :floorplans do |t|
      t.string :name
      t.references :project, foreign_key: true
      t.string :url
      t.text :details

      t.timestamps
    end
  end
end
