class AddAssignedCmToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :assigned_cm_id , :integer, index: true, foreign_key: { to_table: 'users' }
  end
end
