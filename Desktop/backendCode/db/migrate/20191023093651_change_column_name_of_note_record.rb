class ChangeColumnNameOfNoteRecord < ActiveRecord::Migration[5.0]
  def change
    rename_column :note_records, :area_of_sight, :area_of_site
  end
end
