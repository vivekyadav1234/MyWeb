class CreateFloorPlanCrawls < ActiveRecord::Migration[5.0]
  def change
    create_table :floor_plan_crawls do |t|
      t.text :url
      t.string :source_crawl_id
      t.string :source

      #t.timestamps
    end
  end
end
