class AddCategoryToHandles < ActiveRecord::Migration[5.0]
  def change
    add_column :handles, :category, :string
    add_column :addons, :category, :string
  end
end
