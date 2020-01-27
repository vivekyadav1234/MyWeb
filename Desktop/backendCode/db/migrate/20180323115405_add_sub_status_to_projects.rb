class AddSubStatusToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :sub_status, :string
  end
end
