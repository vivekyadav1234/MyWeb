class CreateProjectHandoverUrls < ActiveRecord::Migration[5.0]
  def self.up
    create_table :project_handover_urls do |t|
      t.references :project
      t.text :url
      t.integer :shared_version
      t.timestamps
    end
  end

  def self.down
      drop_table :project_handover_urls
  end
end
