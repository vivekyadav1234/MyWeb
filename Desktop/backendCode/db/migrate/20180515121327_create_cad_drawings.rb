class CreateCadDrawings < ActiveRecord::Migration[5.0]
  def change
    create_table :cad_drawings do |t|
      t.references :project, foreign_key: true
      t.attachment :cad_drawing
      t.string :name

      t.timestamps
    end
  end
end
