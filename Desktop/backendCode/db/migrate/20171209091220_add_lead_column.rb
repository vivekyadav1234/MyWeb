class AddLeadColumn < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :follow_up_time, :datetime
    add_column :leads, :lost_remark, :text
  end
end
