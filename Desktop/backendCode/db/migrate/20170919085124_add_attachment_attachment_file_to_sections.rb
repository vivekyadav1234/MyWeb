class AddAttachmentAttachmentFileToSections < ActiveRecord::Migration
  def self.up
    change_table :sections do |t|
      t.attachment :attachment_file
    end
  end

  def self.down
    remove_attachment :sections, :attachment_file
  end
end
