class AddCMandDesignerCommentsToNoterecords < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :cm_comments, :text
    add_column :note_records, :designer_comments, :text
  end
end
