class AddColumnDurationUserProjectAndNoteToRecordings < ActiveRecord::Migration[5.0]
  def change
    add_column :recordings, :duration, :string
    add_reference :recordings, :user, foreign_key: true
    add_column :recordings, :note, :string
    add_reference :recordings, :project, foreign_key: true
  end
end
