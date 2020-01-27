class AddUniqueIndexToEdgeBandingShadesCode < ActiveRecord::Migration[5.0]
  def change
    add_index :edge_banding_shades, :code, unique: true
  end
end
