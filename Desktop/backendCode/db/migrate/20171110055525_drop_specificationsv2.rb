class DropSpecificationsv2 < ActiveRecord::Migration[5.0]
  def change
    drop_table :specifications, if_exists: true
    drop_table :price_specifications, if_exists: true
  end
end
