class AddNewSocietyValueToNoteRecords < ActiveRecord::Migration[5.0]
  def change
  	add_column :note_records, :new_society_value, :string
  end
end
