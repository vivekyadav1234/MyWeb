class CreateNoteRecords < ActiveRecord::Migration[5.0]
  def change
    create_table :note_records do |t|
      t.text :notes, null: false
      t.references :ownerable, polymorphic: true, index: true
      t.integer :user_id
      t.timestamps
    end
  end
end
