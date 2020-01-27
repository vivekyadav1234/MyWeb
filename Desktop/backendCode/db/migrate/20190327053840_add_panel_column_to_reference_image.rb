class AddPanelColumnToReferenceImage < ActiveRecord::Migration[5.0]
  def change
  	add_column :reference_images, :panel, :boolean, default: false
  end
end
