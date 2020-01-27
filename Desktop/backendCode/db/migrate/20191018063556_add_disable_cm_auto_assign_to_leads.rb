class AddDisableCmAutoAssignToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :disable_cm_auto_assign, :boolean, default: false 
  end
end
