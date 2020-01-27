class AddApprovedFieldsToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :approved_at, :datetime
    add_column :leads, :approved, :boolean, default: false
  end
end
