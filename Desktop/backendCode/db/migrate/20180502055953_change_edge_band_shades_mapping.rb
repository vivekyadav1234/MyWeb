class ChangeEdgeBandShadesMapping < ActiveRecord::Migration[5.0]
  def change
    remove_reference :edge_banding_shades, :shutter_finish, index: true, foreign_key: true
    add_reference :shades, :edge_banding_shade, index: true, foreign_key: true
  end
end
