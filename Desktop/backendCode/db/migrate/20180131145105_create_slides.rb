class CreateSlides < ActiveRecord::Migration[5.0]
  def change
    create_table :slides do |t|
      t.string :title
      t.integer :serial, null: false
      t.json :data, null: false, default: {}

      t.references :presentation, index: true, foreign_key: true

      t.timestamps
    end
  end
end
