class AddIntendedDateToNoteRecords < ActiveRecord::Migration[5.0]
  def self.up
    add_column :note_records, :intended_date, :datetime
  end

  def self.down
    remove_column :note_records, :intended_date
  end
end
