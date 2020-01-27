class AddRemarksToApprovals < ActiveRecord::Migration[5.0]
  def change
    add_column :approvals, :remarks, :string
  end
end
