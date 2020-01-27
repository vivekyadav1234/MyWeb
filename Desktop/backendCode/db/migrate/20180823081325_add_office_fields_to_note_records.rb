class AddOfficeFieldsToNoteRecords < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :type_of_space, :string
    add_column :note_records, :area_of_sight, :string
    add_column :note_records, :status_of_property, :string
    add_column :note_records, :project_commencement_date, :datetime
    add_column :note_records, :address_of_site, :string
    add_column :note_records, :layout_and_photographs_of_site, :string
  end
end
