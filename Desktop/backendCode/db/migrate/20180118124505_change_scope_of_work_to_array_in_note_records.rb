class ChangeScopeOfWorkToArrayInNoteRecords < ActiveRecord::Migration[5.0]
  def up
      change_column :note_records, :scope_of_work, :text, array: true, default: [], using: "(string_to_array(scope_of_work, ','))"
  end

  def down
      change_column :note_records, :scope_of_work, :text, array: false, default: nil, using: "(array_to_string(scope_of_work, ','))"
  end
end
