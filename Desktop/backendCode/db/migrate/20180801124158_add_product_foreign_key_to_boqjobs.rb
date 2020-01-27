class AddProductForeignKeyToBoqjobs < ActiveRecord::Migration[5.0]
  def change
  	add_foreign_key :boqjobs, :products, column: 'product_id'
  end
end
