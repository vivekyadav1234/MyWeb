# == Schema Information
#
# Table name: lead_priorities
#
#  id               :integer          not null, primary key
#  priority_number  :integer
#  lead_source_id   :integer
#  lead_type_id     :integer
#  lead_campaign_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class LeadPrioritySerializer < ActiveModel::Serializer
  attributes :id, :priority_number, :lead_source_id, :lead_type_id, :lead_campaign_id, 
    :created_at, :updated_at

  attribute :lead_source
  attribute :lead_type
  attribute :lead_campaign

  def lead_source
    object.lead_source&.name || 'All'
  end

  def lead_type
    object.lead_type&.name || 'All'
  end

  def lead_campaign
    object.lead_campaign&.name || 'All'
  end
end
