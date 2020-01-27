class AddFabricImageToProductVariant < ActiveRecord::Migration[5.0]
  def change
    add_attachment :product_variants, :fabric_image
  end
end
