class CreatePresentationsProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :presentations_products do |t|
      t.references :product, foreign_key: true
      t.references :presentation, foreign_key: true
      t.integer :quantity
      t.string :space
      t.timestamps
    end
  end
end
