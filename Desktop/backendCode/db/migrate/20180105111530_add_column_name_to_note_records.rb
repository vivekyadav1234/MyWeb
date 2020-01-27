class AddColumnNameToNoteRecords < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :remarks_of_sow, :string
    add_column :note_records, :possession_status_date, :string
  end
end
