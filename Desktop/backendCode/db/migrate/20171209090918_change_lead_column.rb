class ChangeLeadColumn < ActiveRecord::Migration[5.0]
  def change
    change_column :leads, :lead_status, :string, null: false, default: "not_attempted"
  end
end
