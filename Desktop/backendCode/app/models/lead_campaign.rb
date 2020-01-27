# == Schema Information
#
# Table name: lead_campaigns
#
#  id                   :integer          not null, primary key
#  name                 :string
#  start_date           :datetime
#  end_date             :datetime
#  status               :string           default("default"), not null
#  location             :string
#  not_removable        :boolean          default(FALSE), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  assigned_cs_agent_id :integer
#

class LeadCampaign < ApplicationRecord
  belongs_to :assigned_cs_agent, class_name: 'User'

  has_many :leads
  has_many :lead_priorities

  validates_presence_of :name
  validates_uniqueness_of :name

  ALL_STATUSES = %w(active inactive)

  def LeadCampaign.request_a_callback_campaign
    LeadCampaign.find_by(name: 'request_a_callback')
  end

  def LeadCampaign.referral_partner_campaign
    LeadCampaign.find_by(name: 'Referral Partner Campaign')
  end

  def LeadCampaign.active_campaign
    active_campaign = LeadCampaign.all.map do |lead_campaign|
      if lead_campaign.status == "active"
        lead_campaign.attributes.slice("id", "name")
      end
    end
    active_campaign.compact
  end

  def LeadCampaign.make_inactive_leads
    LeadCampaign.all.each do |lc|
      if lc.end_date.present? && lc.end_date < DateTime.now
        lc.status = "inactive"
        lc.save!
      end
    end
  end

  def LeadCampaign.arrivae_champion_campaign
    LeadCampaign.find_by(name: 'Arrivae Champion Program')
  end
end
