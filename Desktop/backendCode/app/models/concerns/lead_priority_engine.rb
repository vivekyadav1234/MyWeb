class LeadPriorityEngine
  def initialize(cs_agent=nil)
    @all_priorities = LeadPriority.order(priority_number: :asc)
    @leads_to_consider = Lead.available_for_queue.order(:id)
    @cs_agent = cs_agent
    @lead_queue = []
  end

  # return a lead for cs_agent as per our priority algo.
  def get_prioritized_lead
    # the variable that will hold the lead to be returned. Could be nil if nothing found.
    lead_to_return = nil
    assigned_leads_for_queue = @cs_agent.forcefully_assigned_leads.where.not(lead_status: ["dropped", "lost", "qualified", "delayed_possession", "delayed_project"])
    ActiveRecord::Base.transaction do
      ActiveRecord::Base.connection.execute('LOCK lead_queues IN ACCESS EXCLUSIVE MODE')
      # First check if any lead is assigned to this agent (forcefully assigned, by lead head)
      if new_leads.present?
        lead_to_return = @fresh_lead_to_return.first
      else
        if assigned_leads_for_queue.present?
          lead_to_return = assigned_leads_for_queue.first
          return lead_to_return if lead_to_return.present?
        elsif LeadQueue.all.count > 0
          leads_to_display = LeadQueue.all.sort_by(&:id).pluck(:lead_id).reverse
          lead_to_display = leads_to_display.pop
          lead_to_return = Lead.find lead_to_display
          LeadQueue.where(lead_id: lead_to_display).first.delete
        else
          lead_to_return = @leads_to_consider.sample
        end
      end
    end
    if lead_to_return.present? && lead_to_return.lead_status == "lost"
      get_prioritized_lead
    else
      return lead_to_return
    end
  end


  def generate_queue
    clear_queue
    follow_up_leads = fetch_follow_up_leads.take(PRIORITY_STACK_CONFIGURATION["follow_up_leads"]).sort_by(&:scheduled_at).pluck(:ownerable_id)
    not_contactable_leads = fetch_not_contactable_leads.take(PRIORITY_STACK_CONFIGURATION["not_contactable_leads"]).sort_by(&:scheduled_at).pluck(:ownerable_id)
    escalated_leads = Lead.where(lead_escalated: true, lead_status: ["not_contactable", "follow_up", "not_attempted", "claimed", "not_claimed", "delayed_possession", "delayed_project"]).where.not(id: (follow_up_leads + not_contactable_leads)).pluck(:id).take(PRIORITY_STACK_CONFIGURATION["escalated_leads"])
    fresh_leads = @leads_to_consider.where.not(id: (escalated_leads + follow_up_leads + not_contactable_leads)).pluck(:id).sort.take(PRIORITY_STACK_CONFIGURATION["new_leads"])

    @lead_queue.push fresh_leads
    @lead_queue.push follow_up_leads
    @lead_queue.push escalated_leads.shuffle
    @lead_queue.push not_contactable_leads
    @lead_queue = @lead_queue.flatten.uniq.take(PRIORITY_STACK_CONFIGURATION["queue"]).compact
    leads = Lead.where(id: @lead_queue)
    leads = leads.pluck(:id) - leads.where(lead_status: ["lost", "lost_after_5_tries", "qualified"]).pluck(:id)
    @lead_queue = @lead_queue & leads
    @lead_queue.each do |queue|
      LeadQueue.create(lead_id: queue)
    end
    # UserNotifierMailer.lead_queue_generation.deliver_now
  end


  private

  def clear_queue
    LeadQueue.destroy_all
  end

  def fetch_follow_up_leads
    Event.where(ownerable_type: "Lead", scheduled_at: Time.zone.now..(Time.zone.now+1.hour), agenda: "follow_up")
  end

  def fetch_not_contactable_leads
    Event.where(ownerable_type: "Lead", scheduled_at: Time.zone.now..(Time.zone.now+1.hour), agenda: "not_contactable")
  end

  def new_leads
    @new_leads = Lead.where("leads.created_at >= ?", Time.zone.now - 2.hour).where(lead_status: "not_attempted").distinct
    @seen_leads = @new_leads.joins(:lead_users).where(lead_users: { active: true}).distinct
    @fresh_lead_to_return  =  (@new_leads - @seen_leads)
  end
end
