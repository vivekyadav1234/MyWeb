class AddAttachmentToNoteRecords < ActiveRecord::Migration[5.0]
  def self.up
    change_table :note_records do |t|
      t.attachment :lead_floorplan
    end
  end

  def self.down
    remove_attachment :note_records, :lead_floorplan
  end
end
