class AddPanelToCadDrawing < ActiveRecord::Migration[5.0]
  def self.up
    add_column :cad_drawings, :panel, :boolean, default: false
  end

  def self.down
    remove_column :cad_drawings, :panel
  end
end
