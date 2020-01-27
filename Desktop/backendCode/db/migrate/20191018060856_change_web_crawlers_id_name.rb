class ChangeWebCrawlersIdName < ActiveRecord::Migration[5.0]
  def change
    rename_column :web_crawl_floorplans, :web_crawlers_id, :web_crawler_id
  end
end
