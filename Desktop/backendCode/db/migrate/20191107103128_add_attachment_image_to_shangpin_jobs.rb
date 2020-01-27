class AddAttachmentImageToShangpinJobs < ActiveRecord::Migration
  def self.up
    change_table :shangpin_jobs do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :shangpin_jobs, :image
  end
end
