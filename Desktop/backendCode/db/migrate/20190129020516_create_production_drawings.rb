class CreateProductionDrawings < ActiveRecord::Migration[5.0]
  def change
    create_table :production_drawings do |t|
      t.references :project_handover, foreign_key: true, null: true
      t.references :line_item, polymorphic: true

      t.timestamps
    end
  end
end
