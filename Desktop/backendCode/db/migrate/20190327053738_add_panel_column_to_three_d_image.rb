class AddPanelColumnToThreeDImage < ActiveRecord::Migration[5.0]
  def change
  	  add_column :three_d_images, :panel, :boolean, default: false
  end
end
