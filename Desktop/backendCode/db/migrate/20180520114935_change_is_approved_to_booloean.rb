class ChangeIsApprovedToBooloean < ActiveRecord::Migration[5.0]
  def change
    change_column :proposal_docs, :is_approved, "boolean USING CAST(is_approved AS boolean)"
  end
end
