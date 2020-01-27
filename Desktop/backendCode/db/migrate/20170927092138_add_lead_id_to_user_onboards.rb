class AddLeadIdToUserOnboards < ActiveRecord::Migration[5.0]
  def change
    add_column :user_onboards, :lead_id, :integer
  end
end
