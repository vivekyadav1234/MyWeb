# This concern containes methods related to getting data from Admin Screen. This will prevent the Lead model from being bloated.
module AdminScreenConcern
  extend ActiveSupport::Concern

  include TimeModule

  class_methods do
    def lead_metrics(week_from_date = nil)
      h = Hash.new
      leads = self.all
      h[:total_leads] = leads.count
      h[:qualified] = leads.approved_users.count
      h[:percent_qualified] = ((h[:qualified]/h[:total_leads].to_f) * 100.0).round(2)
      h[:lost] = get_lost_leads
      h[:avg_qualification_time] = leads.average_qualification_time.round(2)
      h[:percent_leads] = leads.percent_qualified_in_time(48).round(2)  # % of leads qualified in 48 hours
      h[:avg_first_attempt_time] = leads.avg_first_attempt_time.round(2)
      h[:percent_first_attempt_24h] = leads.percent_first_time_in_time(24).round(2)

      # weekly data (in arrays)
      week_start_date = week_from_date.present? ? Date.parse(week_from_date) : Date.today-1.week
      week_start_date += 1.day   # +1.day due to time zone issues - no issue would be there if front-end sent date instead of time.
      h[:lead_acquisition_date_array] = leads.data_by_lead_acquisition_date(week_start_date)
      h[:lead_qualification_date_array] = leads.data_by_lead_qualification_date(week_start_date)

      return h
    end

    def community_metrics(week_from_date = nil)
      h = Hash.new
      leads = self.all
      total = leads.count
      h[:qualified] = leads.approved_users.count
      h[:percent_qualified] = ( (h[:qualified].to_f/total) * 100 ).round(2)
      h[:dropped] = leads.dropped.count
      h[:assigned_to_designer] = leads.joins(project: :designer_projects).where(designer_projects: { active: true }).distinct.count

      h[:work_in_progress] = leads.get_wip_leads

      quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
        INNER JOIN designer_projects ON designer_projects.project_id = projects.id
        INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
        INNER JOIN tags ON tags.id = leads.tag_id
        INNER JOIN users on leads.assigned_cm_id = users.id").
        where(leads: { id: leads }).distinct.includes(:proposals)
      h[:boq_created] = quotations.count
      h[:value_boq_created] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)
      h[:boq_unique_client] = leads.joins(project: :quotations).distinct.count  #simply count leads that have a BOQ

      proposals_shared = Proposal.proposal_shared.joins(project: :lead).where(leads: { id: leads }).distinct
      quotations_shared = quotations.joins(:proposals).where(proposals: { id: proposals_shared }).distinct
      h[:boq_shared] = quotations_shared.count
      h[:value_boq_shared] = MoneyModule.indian_format(quotations_shared.pluck(:total_amount).map(&:to_f).sum)
      h[:boq_shared_unique_client] = leads.joins(project: :proposals).where(proposals: { id: proposals_shared }).distinct.count

      h[:avg_days_assign_designer] = leads.avg_designer_assignment_time.round(2)
      h[:avg_days_designer_first_attempt] = "Not Available"
      h[:percent_designer_assigned_24h] = "Not Available"  #% of cases where designer assigned in less than 24h
      h[:percent_attempts_after_24h] = "Not Available"

      # weekly data (in arrays)
      week_start_date = week_from_date.present? ? Date.parse(week_from_date) : Date.today-1.week
      week_start_date += 1.day   # +1.day due to time zone issues
      h[:boq_creation_date_array] = leads.data_by_boq_creation_date(week_start_date)
      h[:boq_sharing_date_array] = leads.data_by_boq_sharing_date(week_start_date)

      return h
    end

    def cm_designer_metrics(filter_params = {}, week_from_date = nil)
      h = Hash.new
      leads = self.all
      # lead_ids = leads.pluck(:id)
      from_time = filter_params[:from_date].present? ? Date.parse(filter_params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = filter_params[:to_date].present? ? Date.parse(filter_params[:to_date].to_s).end_of_day : Date.today.end_of_day

      # h[:home_visits_target] = leads.joins(project: :events).where(events: { contact_type: "site_visit", scheduled_at: from_time..to_time }).distinct.count
      h[:home_visits_target] = "NA"
      h[:home_visits] = leads.joins(project: :events).where(events: { contact_type: "site_visit", scheduled_at: from_time..to_time }).where(events: { status: 'done' }).distinct.count
      # h[:ec_visits_target] = leads.joins(project: :events).where(events: { contact_type: "experience_center", scheduled_at: from_time..to_time }).distinct.count
      h[:ec_visits_target] = "NA"
      h[:ec_visits] = leads.joins(project: :events).where(events: { contact_type: "experience_center", scheduled_at: from_time..to_time }).where(events: { status: 'done' }).distinct.count

      # byebug
      # quotations = Quotation.joins(project: [:lead, :designer_projects]).where(leads: { id: leads }).distinct
      # quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
      #   INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
      #   INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
      #   where(leads: { id: leads }).distinct
      quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
        INNER JOIN task_escalations ON task_escalations.ownerable_id = projects.id AND task_escalations.ownerable_type = 'Project'
        INNER JOIN task_sets ON task_sets.id = task_escalations.task_set_id
        INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
        INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
        where(leads: { id: leads }).distinct
      projects = Project.where(id: quotations.pluck(:project_id))

      # quotations_shared = quotations.shared
      quotations_shared_target = quotations.where(task_sets: { task_name: TaskSet::BOQ_SHARING_TASK, stage: TaskSet::BOQ_SHARING_STAGES }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:boq_shared_target] = quotations_shared_target.count
      h[:boq_shared_target] = "NA"
      h[:boq_shared] = quotations_shared_target.shared.count
      # h[:value_boq_shared_target] = quotations_shared_target.pluck(:total_amount).map(&:to_f).sum.round(2)
      h[:value_boq_shared_target] = "NA"
      h[:value_boq_shared] = MoneyModule.indian_format(quotations_shared_target.shared.pluck(:total_amount).map(&:to_f).sum)
      payment_collection_target_10 = quotations.where(task_sets: { task_name: TaskSet::BOQ_PAYMENT_ADDITION_TASKS, stage: "10 %" }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:percent_10_payment_target] = payment_collection_target_10.count
      h[:percent_10_payment_target] = "NA"
      h[:percent_10_payment] = payment_collection_target_10.where(task_escalations: {status: "yes"}).count
      payment_collection_target_40 = quotations.where(task_sets: { task_name: TaskSet::BOQ_PAYMENT_ADDITION_TASKS, stage: "10% - 40%" }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:percent_40_payment_target] = payment_collection_target_40.count
      h[:percent_40_payment_target] = "NA"
      h[:percent_40_payment] = payment_collection_target_10.where(task_escalations: {status: "yes"}).count
      tasks_to_consider = TaskEscalation.where(ownerable_type: "Project", ownerable_id: projects.pluck(:id)).or(
        TaskEscalation.where(ownerable_type: "Quotation", ownerable_id: quotations.pluck(:id))
        )
      h[:tasks_done_in_timeline_target] = tasks_to_consider.count
      h[:tasks_done_in_timeline] = tasks_to_consider.where(status: "yes").where("completed_at <= end_time").count
      h[:designer_leads_target] = "NA"
      h[:designer_leads] = leads.designer_only.count
      h[:tasks_delayed_10_40_target] = "NA"
      h[:tasks_delayed_10_40] = tasks_to_consider.joins(:task_set).
        where(task_sets: { stage: "10% - 40%" }).
        where("completed_at <= end_time").count

      h[:avg_days_assign_designer] = leads.avg_designer_assignment_time.round(2)
      h[:avg_days_designer_first_attempt] = "Not Available"
      h[:percent_designer_assigned_24h] = "Not Available"  #% of cases where designer assigned in less than 24h
      h[:percent_attempts_after_24h] = "Not Available"

      # weekly data (in arrays)
      week_start_date = week_from_date.present? ? Date.parse(week_from_date) : Date.today-1.week
      week_start_date += 1.day   # +1.day due to time zone issues
      h[:boq_creation_date_array] = leads.data_by_boq_creation_date_cm(week_start_date)
      h[:boq_sharing_date_array] = leads.data_by_boq_sharing_date_cm(week_start_date)

      return h
    end

    def mkw_business_head(filter_params = {}, week_from_date = nil)
      h = Hash.new
      leads = self.all
      # lead_ids = leads.pluck(:id)
      from_time = filter_params[:from_date].present? ? Date.parse(filter_params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = filter_params[:to_date].present? ? Date.parse(filter_params[:to_date].to_s).end_of_day : Date.today.end_of_day

      # h[:home_visits_target] = leads.joins(project: :events).where(events: { contact_type: "site_visit", scheduled_at: from_time..to_time }).distinct.count
      h[:home_visits_target] = "NA"
      h[:home_visits] = leads.joins(project: :events).where(events: { contact_type: "site_visit", scheduled_at: from_time..to_time }).where(events: { status: 'done' }).distinct.count
      # h[:ec_visits_target] = leads.joins(project: :events).where(events: { contact_type: "experience_center", scheduled_at: from_time..to_time }).distinct.count
      h[:ec_visits_target] = "NA"
      h[:ec_visits] = leads.joins(project: :events).where(events: { contact_type: "experience_center", scheduled_at: from_time..to_time }).where(events: { status: 'done' }).distinct.count

      # byebug
      # quotations = Quotation.joins(project: [:lead, :designer_projects]).where(leads: { id: leads }).distinct
      # quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
      #   INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
      #   INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
      #   where(leads: { id: leads }).distinct
      quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
        INNER JOIN task_escalations ON task_escalations.ownerable_id = projects.id AND task_escalations.ownerable_type = 'Project'
        INNER JOIN task_sets ON task_sets.id = task_escalations.task_set_id
        INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
        INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
        where(leads: { id: leads }).distinct
      projects = Project.where(id: quotations.pluck(:project_id))

      # quotations_shared = quotations.shared
      quotations_shared_target = quotations.where(task_sets: { task_name: TaskSet::BOQ_SHARING_TASK, stage: TaskSet::BOQ_SHARING_STAGES }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:boq_shared_target] = quotations_shared_target.count
      h[:boq_shared_target] = "NA"
      h[:boq_shared] = quotations_shared_target.shared.count
      # h[:value_boq_shared_target] = quotations_shared_target.pluck(:total_amount).map(&:to_f).sum.round(2)
      h[:value_boq_shared_target] = "NA"
      h[:value_boq_shared] = MoneyModule.indian_format(quotations_shared_target.shared.pluck(:total_amount).map(&:to_f).sum)
      payment_collection_target_10 = quotations.where(task_sets: { task_name: TaskSet::BOQ_PAYMENT_ADDITION_TASKS, stage: "10 %" }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:percent_10_payment_target] = payment_collection_target_10.count
      h[:percent_10_payment_target] = "NA"
      h[:percent_10_payment] = payment_collection_target_10.where(task_escalations: {status: "yes"}).count
      payment_collection_target_40 = quotations.where(task_sets: { task_name: TaskSet::BOQ_PAYMENT_ADDITION_TASKS, stage: "10% - 40%" }, task_escalations: { end_time: from_time..to_time }).distinct
      # h[:percent_40_payment_target] = payment_collection_target_40.count
      h[:percent_40_payment_target] = "NA"
      h[:percent_40_payment] = payment_collection_target_10.where(task_escalations: {status: "yes"}).count
      tasks_to_consider = TaskEscalation.where(ownerable_type: "Project", ownerable_id: projects.pluck(:id)).or(
        TaskEscalation.where(ownerable_type: "Quotation", ownerable_id: quotations.pluck(:id))
        )
      h[:tasks_done_in_timeline_target] = tasks_to_consider.count
      h[:tasks_done_in_timeline] = tasks_to_consider.where(status: "yes").where("completed_at <= end_time").count
      h[:new_display_dealers_target] = "NA"
      h[:new_display_dealers] = "NA"
      h[:new_non_display_dealers_target] = "NA"
      h[:new_non_display_dealers] = "NA"
      h[:leads_display_dealers_target] = "NA"
      h[:leads_display_dealers] = "NA"
      h[:leads_non_display_dealers_target] = "NA"
      h[:leads_non_display_dealers] = "NA"

      h[:avg_days_assign_designer] = leads.avg_designer_assignment_time.round(2)
      h[:avg_days_designer_first_attempt] = "Not Available"
      h[:percent_designer_assigned_24h] = "Not Available"  #% of cases where designer assigned in less than 24h
      h[:percent_attempts_after_24h] = "Not Available"

      # weekly data (in arrays)
      week_start_date = week_from_date.present? ? Date.parse(week_from_date) : Date.today-1.week
      week_start_date += 1.day   # +1.day due to time zone issues
      h[:boq_creation_date_array] = leads.data_by_boq_creation_date_mkw(week_start_date)
      h[:boq_sharing_date_array] = leads.data_by_boq_sharing_date_mkw(week_start_date)

      return h
    end

    # hash which maps human readable lost reason to values in DB.
    def lost_name_hash
      {
        "General Inquiry" => ['general_inquiry', 'General Inquiry'],
        "Low Budget" => ['low_budget', 'Low Budget'],
        "City Not in Operations" => ['city_not_in_operations', 'City Not in Operations'],
        "Reluctant or Wrong Number" => ['reluctant_to_provide_details_wrong_number', 'Wrong Number'],
        "Language Barrier" => ['language_barrier', 'Language Barrier', 'Language barrier'],
        "Less Scope of Work" => ['less_scope_of_work', 'Less Scope of Work']
      }
    end

    def get_lost_leads
      h = Hash.new
      leads = self.all.lost_leads
      h[:total] = leads.count
      # fill the various reasons' count
      arr = []

      Lead.lost_name_hash.each do |k, v|
        value = ((leads.where(lost_reason: v).count/h[:total].to_f) * 100.0).round(2)
        arr.push({
          name: k,
          value: value
        })
      end

      arr.push({
        name: 'Other',
        value: (100.0 - arr.map{|hash| hash[:value]}.sum).round(2)
      })

      h[:lost_data_array] = arr
      return h
    end

    def get_wip_leads
      leads = self.all
      projects = Project.joins(:lead).where(leads: { id: leads })
      h = Hash.new
      h[:active] = {
        pre_bid_stage: "TBD",
        percent_10: "TBD",
        percent_10_40: "TBD",
        pre_production: "TBD",
        installation: "TBD",
        handover: "TBD"
      }
      h[:active][:total] = "TBD"
      # h[:active][:total] = h[:active][:pre_bid_stage] + h[:active][:percent_10] + h[:active][:percent_10_40] + h[:active][:pre_production] + h[:active][:installation] + h[:active][:handover]
      h[:inactive] = "TBD"
      h[:on_hold] = "TBD"
      h[:total] = "TBD"
      # h[:total] = h[:active][:total] + h[:inactive] + h[:on_hold]
      return h
    end

    def data_by_lead_acquisition_date(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        filtered_leads = leads.filter_date_admin({ date_filter_type: "acquisition", from_date: from_date, to_date: from_date }).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = filtered_leads.count
        h[:qualified] = filtered_leads.approved_users.count
        h[:percent_qualified] = ((h[:qualified]/h[:total].to_f) * 100.0).round(2)
        h[:lost] = filtered_leads.lost_leads.count

        arr << h
      end

      return arr
    end

    def data_by_lead_qualification_date(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        filtered_leads = leads.filter_date_admin({ date_filter_type: "qualification", from_date: from_date, to_date: from_date }).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:qualified] = filtered_leads.approved_users.count

        arr << h
      end

      return arr
    end

    def data_by_boq_creation_date(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id
          INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
          INNER JOIN tags ON tags.id = leads.tag_id
          INNER JOIN users on leads.assigned_cm_id = users.id").
          where(projects: { id: projects }).where(created_at: from_time..to_time).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)

        arr << h
      end

      return arr
    end

    def data_by_boq_sharing_date(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id
          INNER JOIN leads ON leads.id = projects.lead_id AND leads.duplicate = false
          INNER JOIN tags ON tags.id = leads.tag_id
          INNER JOIN users on leads.assigned_cm_id = users.id").
          joins(:proposals).
          where(projects: { id: projects }).where(proposals: { created_at: from_time..to_time }).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)

        arr << h
      end

      return arr
    end

    def data_by_boq_creation_date_cm(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
          where(projects: { id: projects }).where(created_at: from_time..to_time).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)
        h[:target_total] = "NA"
        h[:target_value] = "NA"

        arr << h
      end

      return arr
    end

    def data_by_boq_sharing_date_cm(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id").
          joins(:proposals).
          where(projects: { id: projects }).where(proposals: { created_at: from_time..to_time }).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)
        h[:target_total] = "NA"
        h[:target_value] = "NA"

        arr << h
      end

      return arr
    end

    def data_by_boq_creation_date_mkw(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN leads ON leads.id = projects.lead_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id
          INNER JOIN users ON leads.assigned_cm_id = users.id").
          where(projects: { id: projects }).where(created_at: from_time..to_time).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)
        h[:target_total] = "NA"
        h[:target_value] = "NA"

        arr << h
      end

      return arr
    end

    def data_by_boq_sharing_date_mkw(week_start_date)
      arr = []
      week_start_time = week_start_date.beginning_of_day
      leads = self.all

      (0..7).each do |i|
        h = Hash.new
        from_date = week_start_date + i.days
        to_date = week_start_date + (i + 1).days
        from_time = from_date.beginning_of_day
        to_time = from_date.end_of_day
        projects = Project.joins(:lead).where(leads: { id: leads }).distinct
        projects_qualified = projects.where(status: 'qualified')
        quotations = Quotation.joins("INNER JOIN projects ON projects.id = quotations.project_id
          INNER JOIN leads ON leads.id = projects.lead_id
          INNER JOIN designer_projects ON designer_projects.project_id = projects.id
          INNER JOIN users ON leads.assigned_cm_id = users.id").
          joins(:proposals).
          where(projects: { id: projects }).where(proposals: { created_at: from_time..to_time }).distinct
        h[:date] = (week_start_date + i.days).strftime("%d-%m-%Y")
        h[:total] = quotations.count
        h[:value] = MoneyModule.indian_format(quotations.pluck(:total_amount).map(&:to_f).sum)
        h[:target_total] = "NA"
        h[:target_value] = "NA"

        arr << h
      end

      return arr
    end

    # avg qualification time in days for a given set of leads
    def average_qualification_time
      lead_ids = self.all.pluck(:id)
      return 0 unless lead_ids.count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT AVG(projects.created_at - leads.created_at) AS avg_time_passed
        FROM   leads
        INNER JOIN   projects ON projects.lead_id = leads.id
        WHERE  leads.id IN (#{lead_ids.join(",")});"
      )

      avg_time = result[0]["avg_time_passed"]
      return 0 unless avg_time.present?
      str = avg_time.include?('day') ? 'day' : 'days'
      arr = avg_time.split(str)
      if arr.size == 1  #case where it is less than a day
        return TimeModule.time_to_hours(arr.last.strip)/24.0
      else
        return arr[0].strip.to_f + TimeModule.time_to_hours(arr[1].strip)/24.0
      end
    end

    # avg first attempt time by CS agent in days for a given set of leads
    # first attempt assumed be when the first lead_user is created for a lead.
    def avg_first_attempt_time
      # take only those leads which have lead_users
      lead_ids = self.all.joins(:lead_users).pluck(:id).uniq
      return 0 unless lead_ids.count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT AVG(lead_attempt_time - lead_creation_time) AS avg_time_passed FROM (
        SELECT earliest_lead_user.created_at AS lead_attempt_time, leads.created_at AS lead_creation_time FROM leads JOIN (
            SELECT * FROM lead_users
            WHERE id IN (
                SELECT MIN(id) FROM lead_users GROUP BY lead_id
            )
        ) AS earliest_lead_user
        ON leads.id = earliest_lead_user.lead_id
        WHERE leads.id IN (#{lead_ids.join(",")})
        ) AS x;"
      )

      avg_time = result[0]["avg_time_passed"]
      return 0 unless avg_time.present?
      str = avg_time.include?('day') ? 'day' : 'days'
      arr = avg_time.split(str)
      if arr.size == 1  #case where it is less than a day
        return TimeModule.time_to_hours(arr.last.strip)/24.0
      else
        return arr[0].strip.to_f + TimeModule.time_to_hours(arr[1].strip)/24.0
      end
    end

    # avg no of days it takes from qualification date, to assign a designer
    def avg_designer_assignment_time
      # take only those leads which have a project ie are qualified
      lead_ids = self.all.joins(:project).pluck(:id).uniq
      return 0 unless lead_ids.count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT AVG(designer_assignment_time - lead_qualification_time) AS avg_assignment_time FROM (
        SELECT earliest_designer_project.created_at AS designer_assignment_time, projects.created_at AS lead_qualification_time FROM projects JOIN (
            SELECT * FROM designer_projects
            WHERE id IN (
                SELECT MIN(id) FROM designer_projects GROUP BY project_id
            )
        ) AS earliest_designer_project
        ON projects.id = earliest_designer_project.project_id
        INNER JOIN leads ON leads.id = projects.lead_id
        WHERE leads.id IN (#{lead_ids.join(",")})
        ) AS x;"
      )

      avg_time = result[0]["avg_assignment_time"]
      return 0 unless avg_time.present?
      # byebug
      str = avg_time.include?('day') ? 'day' : 'days'
      arr = avg_time.split(str)
      if arr.size == 1  #case where it is less than a day
        return TimeModule.time_to_hours(arr.last.strip)/24.0
      else
        return arr[0].strip.to_f + TimeModule.time_to_hours(arr[1].strip)/24.0
      end
    end

    # percentage of leads qualified in given time
    # time duration given in hours
    def percent_qualified_in_time(duration_in_hours)
      leads = self.all
      return 0 unless leads.count > 0
      total_qualified = leads.approved_users.count
      qualified_in_duration = leads.leads_qualified_in_time(duration_in_hours)

      (qualified_in_duration.to_f/total_qualified) * 100.0
    end

    def leads_qualified_in_time(duration_in_hours)
      # self.all.find_all{ |lead| (lead.status_updated_at - lead.created_at).to_i <= 2}.count
      lead_ids = self.all.approved_users.pluck(:id)
      result = ActiveRecord::Base.connection.execute(
        "SELECT lead_id, qualification_time FROM (
          SELECT id as lead_id, (DATE_PART('day', leads.status_updated_at - leads.created_at) * 24 +
          DATE_PART('hour', leads.status_updated_at - leads.created_at)) AS qualification_time
          FROM leads
          WHERE leads.id IN (#{lead_ids.join(",")})
        ) AS x
        WHERE qualification_time < #{duration_in_hours};"
      )

      return result.count
    end

    def percent_first_time_in_time(duration_in_hours)
      leads = self.all
      return 0 unless leads.count > 0
      total = leads.count
      first_attempt_in_duration = leads.leads_first_attempt_in_time(duration_in_hours)

      (first_attempt_in_duration.to_f/total) * 100.0
    end

    def leads_first_attempt_in_time(duration_in_hours)
      # self.all.find_all{ |lead| (lead.status_updated_at - lead.created_at).to_i <= 2}.count
      lead_ids = self.all.joins(:lead_users).pluck(:id).uniq
      result = ActiveRecord::Base.connection.execute(
        "SELECT lead_id, first_attempt_time FROM (
          SELECT leads.id AS lead_id, (DATE_PART('day', earliest_lead_user.created_at - leads.created_at) * 24 + DATE_PART('hour', earliest_lead_user.created_at - leads.created_at)) AS first_attempt_time FROM leads JOIN (
              SELECT * FROM lead_users
              WHERE id IN (
                  SELECT MIN(id) FROM lead_users GROUP BY lead_id
              )
          ) AS earliest_lead_user
          ON leads.id = earliest_lead_user.lead_id
          WHERE leads.id IN (#{lead_ids.join(",")})
        ) AS x
        WHERE first_attempt_time < #{duration_in_hours};"
      )

      return result.count
    end

    def filter_admin(filter_params = {})
      return self.all if filter_params.blank?
      collection = self.all
      # filter by lead tag
      if filter_params[:lead_tags].present?
        collection = collection.joins("INNER JOIN tags ON tags.id = leads.tag_id").
          where(tags: { id: filter_params[:lead_tags] })
      end

      # filter by city - not needed apparently as CM and designer filters will take care of it
      if filter_params[:city].present? && filter_params[:city] != 'all'
        # no direct lead to city mapping yet - so get the CMs for given cities and filter using that.
        # city = City.find(filter_params[:city])
        cms = User.with_role(:community_manager).joins(:tags).where(tags: {name: ["mkw", "full_home"]})
        cms_for_city = cms.joins(:cities).where(cities: {id: filter_params[:city]}).distinct
        collection = collection.joins(:assigned_cm).where(users: { id: cms_for_city })
      end

      # filter by assigned CM
      if filter_params[:cm].present?
        collection = collection.joins(:assigned_cm).where(users: { id: filter_params[:cm] })
      end

      # filter by assigned designer
      if filter_params[:designers].present?
        collection = collection.joins(project: :designer_projects).where(designer_projects: { active: true, designer_id: filter_params[:designers] })
      end

      # filter by general manager
      if filter_params[:gm].present?
        cms = GmCmMapping.where(gm_id: filter_params[:gm]).pluck(:cm_id).uniq
        collection = collection.joins(:assigned_cm).where(users: { id:  cms})
      end
      # filter by lead source
      if filter_params[:lead_sources].present?
        collection = collection.joins("INNER JOIN lead_sources ON lead_sources.id = leads.lead_source_id").
          where(lead_sources: { id: filter_params[:lead_sources] })
      end

      # filter by lead campaign
      if filter_params[:lead_campaigns].present?
        collection = collection.joins(:lead_campaign).where(lead_campaigns: { id: filter_params[:lead_campaigns] })
      end

      # filter by lead campaign
      if filter_params[:lead_types].present?
        collection = collection.joins(:lead_type).where(lead_types: { id: filter_params[:lead_types] })
      end

      # filter by digital or physical
      if filter_params[:digital_physical].present? && filter_params[:digital_physical] != "all"
        if filter_params[:digital_physical] == "digital"
          collection = collection.joins("INNER JOIN lead_sources ON lead_sources.id = leads.lead_source_id").
            where(lead_sources: { name: Lead::DIGITAL_SOURCES_AWS })
        elsif filter_params[:digital_physical] == "physical"
          collection = collection.joins("INNER JOIN lead_sources ON lead_sources.id = leads.lead_source_id").
            where(lead_sources: { name: Lead::PHYSICAL_SOURCES })
        end
      end

      # filter by overall, fhi or data
      # filter by CM's tag - as per discussion with Sneha.
      if filter_params[:data_scope].present? && filter_params[:data_scope] != "overall_data"
        if filter_params[:data_scope] == "fhi_data"
          # collection = collection.joins(:tag).where(tags: { name: "full_home" })
          collection =  collection.joins(assigned_cm: :tags).where(tags: {name: "mkw"})
        elsif filter_params[:data_scope] == "mkw_data"
          # collection = collection.joins(:tag).where(tags: { name: "mkw" })
          collection =  collection.joins(assigned_cm: :tags).where(tags: {name: "full_home"})
        end
      end

      return collection.distinct
    end

    def filter_date_admin(filter_params = {})
      return self.all if filter_params.blank?

      collection = self.all
      if filter_params[:date_filter_type].present? && ( filter_params[:from_date].present? || filter_params[:to_date].present? )
        # Adding 1 day because of time zone difference which converts 4 Feb to 3 Feb etc.
        from_time = filter_params[:from_date].present? ? ( DateTime.parse(filter_params[:from_date].to_s).beginning_of_day + 1.day ) : Time.zone.now-10.years
        to_time = filter_params[:to_date].present? ? ( DateTime.parse(filter_params[:to_date].to_s).end_of_day + 1.day ) : Date.today.end_of_day

        # filter by lead acquisition date
        if filter_params[:date_filter_type] == "acquisition"
          collection = collection.where(created_at: from_time..to_time)
        elsif filter_params[:date_filter_type] == "qualification"
          collection = collection.joins(:project).where(projects: { created_at: from_time..to_time })
        elsif filter_params[:date_filter_type] == "assignment"
          collection = collection.joins(project: { designer_projects: :designer }).where(designer_projects: { active: true, created_at: from_time..to_time })
        elsif filter_params[:date_filter_type] == "closure"
          payments_in_date = Payment.where(created_at: from_time..to_time)
          collection = collection.joins(project: {quotations: :payments}).where(payments: { id: payments_in_date }).distinct
        end
      end

      return collection.distinct
    end

    def filter_date_gm(filter_params={})
      return self.all if filter_params.blank?
      collection = self.all
      collection = collection.joins(:project).where(projects: { created_at: filter_params[:from_date]..filter_params[:to_date]})
      return collection.distinct
    end

    def filter_digital_physical_gm(filter_params={})
      return self.all if filter_params.blank?
      collection = self.all
      if filter_params[:digital_physical].present? && filter_params[:digital_physical] != "all"
        if filter_params[:digital_physical] == "digital"
          collection = collection.joins("INNER JOIN lead_sources ON lead_sources.id = leads.lead_source_id").
            where(lead_sources: { name: Lead::DIGITAL_SOURCES_AWS })
        elsif filter_params[:digital_physical] == "physical"
          collection = collection.joins("INNER JOIN lead_sources ON lead_sources.id = leads.lead_source_id").
            where(lead_sources: { name: Lead::PHYSICAL_SOURCES })
        end
      end
      return collection.distinct
    end

  end
end
