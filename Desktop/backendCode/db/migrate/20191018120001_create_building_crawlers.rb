class CreateBuildingCrawlers < ActiveRecord::Migration[5.0]
  def change
    create_table :building_crawlers do |t|
      t.string :building_name
      t.string :group_name
      t.string :locality
      t.string :city
      t.timestamps
    end

    add_index :building_crawlers, [:locality, :building_name, :city]
  end
end
