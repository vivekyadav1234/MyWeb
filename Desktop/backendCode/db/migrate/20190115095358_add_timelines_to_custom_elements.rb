class AddTimelinesToCustomElements < ActiveRecord::Migration[5.0]
  def change
    add_column :custom_elements, :asked_timeline, :integer, default: 0
    add_column :custom_elements, :timeline, :integer, default: 0
  end
end
