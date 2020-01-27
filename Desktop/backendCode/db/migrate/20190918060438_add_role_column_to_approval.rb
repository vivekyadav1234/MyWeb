class AddRoleColumnToApproval < ActiveRecord::Migration[5.0]
  def change
    add_column :approvals, :role, :string, null: :false 
    add_column :approvals, :approved_at, :datetime, null: :false
    remove_column :approvals, :type, :string
    add_column :approvals, :approval_scope, :string
  end
end
