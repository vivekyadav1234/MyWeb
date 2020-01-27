class AddColumnToRecordNotes < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :customer_name, :string
    add_column :note_records, :phone, :string
    add_column :note_records, :project_name, :string
    add_column :note_records, :city, :string
    add_column :note_records, :location, :text
    add_column :note_records, :project_type, :string
    add_column :note_records, :accomodation_type, :string
    add_column :note_records, :scope_of_work, :string
    add_column :note_records, :possession_status, :string
    add_column :note_records, :have_homeloan, :string
    add_column :note_records, :call_back_day, :string
    add_column :note_records, :call_back_time, :string
    add_column :note_records, :have_floorplan, :string
    add_column :note_records, :lead_generator, :string
    add_column :note_records, :additional_comments, :text
  end
end
