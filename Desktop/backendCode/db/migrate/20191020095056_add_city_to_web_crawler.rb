class AddCityToWebCrawler < ActiveRecord::Migration[5.0]
  def change
    add_column :web_crawlers, :city, :string
    add_column :web_crawlers, :source_id, :string
  end
end
