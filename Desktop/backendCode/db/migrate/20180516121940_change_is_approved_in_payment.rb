class ChangeIsApprovedInPayment < ActiveRecord::Migration[5.0]
  def change
    change_column :payments, :is_approved, "boolean USING CAST(is_approved AS boolean)"
  end
end
