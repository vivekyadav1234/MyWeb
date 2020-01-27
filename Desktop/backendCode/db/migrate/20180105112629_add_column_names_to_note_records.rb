class AddColumnNamesToNoteRecords < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :home_value, :integer
    add_column :note_records, :budget_value, :integer
  end
end
