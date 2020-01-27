class CreateUserDataMigrations < ActiveRecord::Migration[5.0]
  def change
    create_table :user_data_migrations do |t|
      t.integer :from
      t.integer :to
      t.json :migrated_data, default: {}, null: false
      t.timestamps
    end
  end
end
