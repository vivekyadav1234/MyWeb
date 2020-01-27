class RemoveTypeOfHomeIfExistFromNoteRecords < ActiveRecord::Migration[5.0]
  def change
  	if column_exists?(:note_records, :type_of_home)
      remove_column :note_records, :type_of_home
  	end
  end
end
