class CreateWebCrawlers < ActiveRecord::Migration[5.0]
  def change
    create_table :web_crawlers do |t|
      t.string :name
      t.text :group_name
      t.string :price
      t.text :locality
      t.text :bhk_type
      t.string :possession
      t.string :source

      #t.timestamps
    end
  end
end



