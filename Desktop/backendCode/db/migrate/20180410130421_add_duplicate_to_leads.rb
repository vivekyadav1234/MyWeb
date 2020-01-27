class AddDuplicateToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :duplicate, :boolean, default: false
  end
end
