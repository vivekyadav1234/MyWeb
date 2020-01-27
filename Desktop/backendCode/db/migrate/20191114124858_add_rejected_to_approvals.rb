class AddRejectedToApprovals < ActiveRecord::Migration[5.0]
  def change
    add_column :approvals, :rejected, :boolean, null: false, default: false
  end
end
