class AddLostReasonToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :lost_reason, :string
  end
end
