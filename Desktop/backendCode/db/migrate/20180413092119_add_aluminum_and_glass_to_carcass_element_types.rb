class AddAluminumAndGlassToCarcassElementTypes < ActiveRecord::Migration[5.0]
  def change
    add_column :carcass_element_types, :aluminium, :boolean, default: false
    add_column :carcass_element_types, :glass, :boolean, default: false
  end
end
