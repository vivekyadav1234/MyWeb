class AddLeadSourceToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :lead_source, :string
  end
end
