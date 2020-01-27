class RenameRateToPriceInShutterFinishes < ActiveRecord::Migration[5.0]
  def change
    rename_column :shutter_finishes, :rate, :price
  end
end
