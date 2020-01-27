class CreateProductSpaceTags < ActiveRecord::Migration[5.0]
  def change
    create_table :product_space_tags do |t|
      t.references :tag, index: true, foreign_key: true
      t.references :product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
