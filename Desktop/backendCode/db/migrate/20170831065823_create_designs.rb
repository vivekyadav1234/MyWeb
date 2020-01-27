class CreateDesigns < ActiveRecord::Migration[5.0]
  def change
    create_table :designs do |t|
      t.string :name
      t.references :user, foreign_key: true
      t.references :floorplan, foreign_key: true
      t.text :details
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
