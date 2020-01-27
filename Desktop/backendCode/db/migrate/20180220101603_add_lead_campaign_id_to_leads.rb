class AddLeadCampaignIdToLeads < ActiveRecord::Migration[5.0]
  def change
    add_reference :leads, :lead_campaign, index: true, foreign_key: true
  end
end
