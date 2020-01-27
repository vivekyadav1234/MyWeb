class CreateBuildingCrawlerDetails < ActiveRecord::Migration[5.0]
  def change
    create_table :building_crawler_details do |t|
      t.text :type
      t.string :possession
      t.string :source
      t.string :source_id
      t.references :building_crawler, foreign_key: true
      t.timestamps
    end
  end
end
