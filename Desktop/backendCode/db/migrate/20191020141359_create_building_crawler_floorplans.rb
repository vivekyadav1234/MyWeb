class CreateBuildingCrawlerFloorplans < ActiveRecord::Migration[5.0]
  def change
    create_table :building_crawler_floorplans do |t|
      t.string :url
      t.references :building_crawler, foreign_key: true
      t.timestamps
    end
  end
end
