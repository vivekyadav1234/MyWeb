class AddNewHandoverFileToProject < ActiveRecord::Migration[5.0]
  def self.up
    add_column :projects, :new_handover_file, :boolean, default: false
  end

  def self.down
    remove_column :projects, :new_handover_file
  end
end
