class AddSubtypeToApprovals < ActiveRecord::Migration[5.0]
  def change
    add_column :approvals, :subtype, :string
  end
end
