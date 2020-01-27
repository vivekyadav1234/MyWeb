class AddSeenByCategory < ActiveRecord::Migration[5.0]
  def self.up
    add_column :cad_uploads, :seen_by_category, :boolean, default: false
  end

  def self.down
    remove_column :cad_uploads, :seen_by_category
  end
end
