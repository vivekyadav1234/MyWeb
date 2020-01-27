class RenameLevelToUserLevelInUsers < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :level, :user_level
  end
end
