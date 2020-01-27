class CreateUrbanLadderInfos < ActiveRecord::Migration[5.0]
  def change
    create_table :urban_ladder_infos do |t|
      t.integer :product_id, null: false
      t.string :master_sku, null: false
      t.string :product_template, null: false
      t.string :url

      t.references :product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
