class AddSeenByCategoryToCustomElements < ActiveRecord::Migration[5.0]
  def self.up
    add_column :custom_elements, :seen_by_category, :boolean, default: false
  end

  def self.down
    remove_column :custom_elements, :seen_by_category
  end
end
