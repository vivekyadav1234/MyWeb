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

class LeadPriority < ApplicationRecord
  belongs_to :lead_type, optional: true
  belongs_to :lead_source, optional: true
  belongs_to :lead_campaign, optional: true

  has_many :lead_queues, dependent: :destroy

  validates :priority_number, presence: true, uniqueness: true, numericality: { greater_than: 0 }

  validates_uniqueness_of :lead_source, scope: [ :lead_type_id, :lead_campaign_id ]
  validate :all_cannot_be_empty

  before_validation :populate_priority_number, on: :create

  # NOTE: lower priority number means higher priority!
  scope :highest_to_lowest, -> { order(priority_number: :asc) }

  def self.select_options
    lead_types = LeadType.all.map{|c| {name: c.name, id: c.id} }
    lead_sources = LeadSource.all.map{|c| {name: c.name, id: c.id} }
    lead_campaigns = LeadCampaign.all.map{|c| {name: c.name, id: c.id} }

    {
      lead_types: lead_types,
      lead_sources: lead_sources,
      lead_campaigns: lead_campaigns
    }
  end

  # overwriting destroy method as destroy must also adjust priority number of priorities
  # lower in the order. (Move all of them up the list by 1)
  def destroy!
    ActiveRecord::Base.transaction do
      destroyed_priority_number = priority_number
      self.destroy!
      LeadPriority.where("priority_number >?", destroyed_priority_number).each do |priority|
        priority.update!(priority_number: priority.priority_number - 1)
      end
    end
  end

  # If the highest priority_number is 10, then this will set 11
  def populate_priority_number
    self.priority_number = LeadPriority.pluck(:priority_number).max.to_i + 1
  end

  # Move a priority to a specific priority_number in the queue.
  def move_to_number(new_priority_number)
    return false if priority_number == new_priority_number

    old_priority_number = priority_number
    if new_priority_number < old_priority_number  #Move up the queue
      ActiveRecord::Base.transaction do
        self.update!(priority_number: LeadPriority.pluck(:priority_number).max + 10000)
        LeadPriority.where(priority_number: new_priority_number..(old_priority_number - 1)).order(
          priority_number: :desc).each do |priority|
          priority.update!(priority_number: priority.priority_number + 1)
        end
        self.update!(priority_number: new_priority_number)
      end
    else  #move down the queue
      ActiveRecord::Base.transaction do
        self.update!(priority_number: LeadPriority.pluck(:priority_number).max + 10000)
        LeadPriority.where(priority_number: (old_priority_number + 1)..new_priority_number).order(
          priority_number: :asc).each do |priority|
          priority.update!(priority_number: priority.priority_number - 1)
        end
        self.update!(priority_number: new_priority_number)
      end
    end
  end

  # Move priority up one step in the queue
  def move_up_one_step
    return false if LeadPriority.pluck(:priority_number).min == priority_number
    previous_priority = LeadPriority.where("priority_number <?", priority_number).order(priority_number: :asc).last
    previous_priority_number = previous_priority.priority_number
    current_priority_number = priority_number
    max_priority_number = LeadPriority.pluck(:priority_number).max
    ActiveRecord::Base.transaction do
      previous_priority.update!(priority_number: max_priority_number + 10000)
      self.update!(priority_number: previous_priority_number)
      previous_priority.update!(priority_number: current_priority_number)
    end
  end

  # Move priority down one step in the queue
  def move_down_one_step
    return false if LeadPriority.pluck(:priority_number).max == priority_number
    next_priority = LeadPriority.where("priority_number >?", priority_number).order(priority_number: :asc).first
    next_priority_number = next_priority.priority_number
    current_priority_number = priority_number
    max_priority_number = LeadPriority.pluck(:priority_number).max
    ActiveRecord::Base.transaction do
      next_priority.update!(priority_number: max_priority_number + 10000)
      self.update!(priority_number: next_priority_number)
      next_priority.update!(priority_number: current_priority_number)
    end
  end

  # move to top of priority queue
  def move_to_top
    higher_priorities = LeadPriority.where.not(id: self.id).where("priority_number <=?", priority_number)
    ActiveRecord::Base.transaction do
      self.update!(priority_number: LeadPriority.pluck(:priority_number).max + 10000)
      higher_priorities.order(priority_number: :desc).each do |priority|
        puts "+++++++++++#{priority.id}++++++++++++++"
        priority.increment_priority_number
      end
      self.update!(priority_number: 1)
    end
  end

  # move to bottom of priority queue
  def move_to_bottom
    lower_priorities = LeadPriority.where.not(id: self.id).where("priority_number >=?", priority_number)
    ActiveRecord::Base.transaction do
      self.update!(priority_number: LeadPriority.pluck(:priority_number).max + 10000)
      lower_priorities.order(priority_number: :asc).each do |priority|
        priority.decrement_priority_number
      end
      self.update!(priority_number: LeadPriority.count)
    end
  end

  # doesn't care about validations
  def decrement_priority_number
    self.update!(priority_number: priority_number - 1)
  end

  # doesn't care about validations
  def increment_priority_number
    self.update!(priority_number: priority_number + 1)
  end

  private
  def all_cannot_be_empty
    errors.add(:lead_type, 'at least one of Lead type, source or campaign must be present') if ( 
      lead_source_id.blank? && lead_type_id.blank? && lead_campaign_id.blank? )
  end
end
