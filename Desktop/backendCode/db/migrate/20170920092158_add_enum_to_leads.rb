class AddEnumToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :user_type, :integer
  end
end
