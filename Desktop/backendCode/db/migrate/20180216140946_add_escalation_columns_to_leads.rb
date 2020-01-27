class AddEscalationColumnsToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :lead_escalated, :boolean, null: false, default: false
    add_column :leads, :reason_for_escalation, :string
  end
end
