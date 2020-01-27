class AddColumnToNoteRecord < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :new_city_value, :string
    add_column :note_records, :new_locality_value, :string
    add_column :note_records, :good_time_to_call, :datetime
  end
end
