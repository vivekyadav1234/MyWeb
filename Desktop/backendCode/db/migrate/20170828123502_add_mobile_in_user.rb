class AddMobileInUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :contact, :string
    add_column :users, :role, :string
  end
end
