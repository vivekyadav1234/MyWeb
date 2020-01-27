class AddSeenByCategoryToBoq < ActiveRecord::Migration[5.0]
  def self.up
    add_column :quotations, :seen_by_category, :boolean, default: false
  end

  def self.down
    remove_column :quotations, :seen_by_category
  end
end
