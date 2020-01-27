class AddProductVariantRefrenceToBoqjob < ActiveRecord::Migration[5.0]
  def change
    add_reference :boqjobs, :product_variant, foreign_key: true, optional: :true
  end
end
