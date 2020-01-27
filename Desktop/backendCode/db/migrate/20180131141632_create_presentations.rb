class CreatePresentations < ActiveRecord::Migration[5.0]
  def change
    create_table :presentations do |t|
      t.string :title, null: false
      t.attachment :ppt

      t.references :project, index: true, foreign_key: true
      t.references :designer, index: true, foreign_key: { to_table: :users}

      t.timestamps
    end
  end
end
