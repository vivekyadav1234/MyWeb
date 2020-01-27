class AddColumnIsNewToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :is_new, :boolean, default: false
  end
end
