class AddDesignerIdToDesigns < ActiveRecord::Migration[5.0]
  def change
    remove_column :designs, :user_id, :integer
    add_column :designs, :designer_id, :integer
  end
end
