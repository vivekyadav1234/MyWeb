class AddStatusToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :status, :string
    add_column :projects, :remarks, :string
  end
end
