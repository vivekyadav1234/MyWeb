class AddIsChampionToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :is_champion, :boolean, default: false
  end
end
