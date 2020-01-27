# == Schema Information
#
# Table name: lead_types
#
#  id                   :integer          not null, primary key
#  name                 :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  assigned_cs_agent_id :integer
#

class LeadType < ApplicationRecord
  belongs_to :assigned_cs_agent, class_name: 'User'

  has_many :leads
  has_many :lead_priorities

  validates_presence_of :name
  validates_uniqueness_of :name

  ALL_TYPES = ["customer", "designer", "broker", "manufacturer"]

  def name=(value)
    self[:name] = value.strip.downcase
  end
end
