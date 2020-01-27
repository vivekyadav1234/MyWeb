class RemoveSourceTypeFromLeads < ActiveRecord::Migration[5.0]
  def change
    remove_column :leads, :lead_source_temp, :string
    remove_column :leads, :user_type, :string
  end
end
