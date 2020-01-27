class CreateLineMarkings < ActiveRecord::Migration[5.0]
  def change
    create_table :line_markings do |t|
      t.references :project, index: true, foreign_key: true
      t.string :name
      t.text :description
      t.timestamps
    end
  end
end
