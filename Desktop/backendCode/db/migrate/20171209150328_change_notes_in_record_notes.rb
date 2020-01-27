class ChangeNotesInRecordNotes < ActiveRecord::Migration[5.0]
  def change
  	change_column :note_records, :notes, :text, null: true
  end
end
