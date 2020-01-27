class AddHiddenToMaterialsAndFinishes < ActiveRecord::Migration[5.0]
  def change
    add_column :core_materials, :hidden, :boolean, default: false
    add_column :shutter_finishes, :hidden, :boolean, default: false
  end
end
