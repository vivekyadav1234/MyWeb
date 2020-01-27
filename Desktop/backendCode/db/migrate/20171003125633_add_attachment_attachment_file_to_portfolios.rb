class AddAttachmentAttachmentFileToPortfolios < ActiveRecord::Migration
  def self.up
    change_table :portfolios do |t|
      t.attachment :attachment_file
    end
  end

  def self.down
    remove_attachment :portfolios, :attachment_file
  end
end
