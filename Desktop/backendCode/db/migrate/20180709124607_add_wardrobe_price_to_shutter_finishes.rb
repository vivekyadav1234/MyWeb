class AddWardrobePriceToShutterFinishes < ActiveRecord::Migration[5.0]
  def change
    add_column :shutter_finishes, :wardrobe_price, :float
  end
end
