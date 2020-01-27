class AddParentIdToSections < ActiveRecord::Migration[5.0]
  def change
    add_column :sections, :parent_id, :integer
  end
end
