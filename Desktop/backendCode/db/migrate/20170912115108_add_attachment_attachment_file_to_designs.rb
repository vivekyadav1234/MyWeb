class AddAttachmentAttachmentFileToDesigns < ActiveRecord::Migration
  def self.up
    change_table :designs do |t|
      t.attachment :attachment_file
    end
  end

  def self.down
    remove_attachment :designs, :attachment_file
  end
end
