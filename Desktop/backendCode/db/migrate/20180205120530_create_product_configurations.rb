class CreateProductConfigurations < ActiveRecord::Migration[5.0]
  def change
    create_table :product_configurations do |t|
      t.string :name
      t.text :description
      t.string :code

      t.references :section, index: true, foreign_key: true   #sub-section actually

      t.timestamps
    end

    add_reference :products, :product_configuration, index: true, foreign_key: true
  end
end
