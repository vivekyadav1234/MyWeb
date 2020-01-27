class RemoveJsonbFromUsers < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :user_preferences, :jsonb
  end
end
