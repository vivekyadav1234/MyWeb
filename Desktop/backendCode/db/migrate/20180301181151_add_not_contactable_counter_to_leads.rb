class AddNotContactableCounterToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :not_contactable_counter, :integer, null: false, default: 0
  end
end
