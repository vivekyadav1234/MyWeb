class AddActiveToLeadUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_users, :active, :boolean, default: false
  end
end
