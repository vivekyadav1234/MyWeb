class CreatePriceConfigurators < ActiveRecord::Migration[5.0]
  def change
    create_table :price_configurators do |t|
      t.integer :total_price_cents
      t.string :pricable_type
      t.integer :pricable_id

      t.timestamps
    end
  end
end
