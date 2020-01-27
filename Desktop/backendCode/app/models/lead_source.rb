# == Schema Information
#
# Table name: lead_sources
#
#  id                   :integer          not null, primary key
#  name                 :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  assigned_cs_agent_id :integer
#

class LeadSource < ApplicationRecord
  belongs_to :assigned_cs_agent, class_name: 'User'

  has_many :leads
  has_many :lead_priorities

  validates_presence_of :name
  validates_uniqueness_of :name

  ALL_SOURCES = %w(broker housing_finance digital_marketing website walk-in_customer)

  def LeadSource.referral
    LeadSource.find_by(name: 'referral')
  end

  def LeadSource.broker
    LeadSource.find_by(name: 'broker')
  end

  def name=(value)
    self[:name] = value.strip.downcase
  end
end
