class CreateWebCrawlFloorplans < ActiveRecord::Migration[5.0]
  def change
    create_table :web_crawl_floorplans do |t|
      t.text :url
      t.references :web_crawlers, foreign_key: true

      #t.timestamps
    end
  end
end
