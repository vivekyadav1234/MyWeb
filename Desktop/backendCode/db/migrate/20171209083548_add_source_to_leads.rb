class AddSourceToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :source, :string, null: false, default: "digital"
    rename_column :leads, :approved, :lead_status
    rename_column :leads, :approved_at, :status_updated_at
    change_column :leads, :lead_status, :string
  end
end
