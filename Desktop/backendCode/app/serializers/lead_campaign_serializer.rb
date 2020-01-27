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

class LeadCampaignSerializer < ActiveModel::Serializer
  attributes :id, :name, :start_date, :end_date, :status, :location, :created_at, :updated_at
end
