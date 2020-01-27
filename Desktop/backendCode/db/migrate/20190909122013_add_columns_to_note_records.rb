class AddColumnsToNoteRecords < ActiveRecord::Migration[5.0]
  def change
  	add_column :note_records, :site_measurement_required, :boolean, default: false
    add_column :note_records, :site_measurement_date, :datetime
  	add_column :note_records, :visit_ec, :boolean, default: false
  	add_column :note_records, :visit_ec_date, :datetime
  end
end
