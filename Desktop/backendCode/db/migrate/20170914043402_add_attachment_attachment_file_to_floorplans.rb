class AddAttachmentAttachmentFileToFloorplans < ActiveRecord::Migration
  def self.up
    change_table :floorplans do |t|
      t.attachment :attachment_file
    end
  end

  def self.down
    remove_attachment :floorplans, :attachment_file
  end
end
