# This concern containes methods related to getting data from Arrivae Weekly Statistics screen.
# This will prevent the Lead model from being bloated.
module ArrivaeWeeklyStatisticsConcern
  extend ActiveSupport::Concern

  START_DATE_LEAD_STATISTICS = Date.parse('01-01-2018')
  DIGITAL_SOURCES_AWS = %w(digital_marketing website sem google digital_source opti optin)
  PHYSICAL_SOURCES = %w(broker dealer referral hfc housing_finance)
  CM_EMAILS_FOR_AWS_FHI = %w(saurabh@arrivae.com nikunj@arrivae.com vidhi@arrivae.com dipti@arrivae.com sudhir@arrivae.com pallavini@arrivae.com rajkiran@arrivae.com dimple@arrivae.com madhuri@arrivae.com pradnya@arrivae.com)
  CM_EMAILS_FOR_AWS_MKW = %w(sheelu@arrivae.com sangeeth@arrivae.com kapil@arrivae.com manishthakkar@arrivae.com)

  class_methods do
    # The logic for calculating this value is as follows:
    #
    # The targets in the arrivae_weekly_statistics.yml file are the base and are defined at the
    # For a city, the target will be the sum of targets of all CMs mapped to that city.
    # When choosing a designer (or multiple), the targets per designer will be distributed among
    # the designers proportionately. For example, if the target is 20 for CM, and the CM has 4
    # designers, then the target per designer will be 20/4 = 5.
    #
    # If a date filter is applied, then some targets should be adjusted proportionately. For example,
    # 7 days will mean multiplication by 1.00. 5 days by 5/7 etc.
    #
    # If options has truthy :one_week_only, from_date and to_date in filter_params will be ignored.
    # This is useful for getting the weekly data independent of the dates in the filter_params.
    def aws_target_data_factor(filter_params, options = {})
      return 0 if filter_params.blank? || filter_params[:data_scope] == 'overall_data'
      factor = 1.0

      # Based on the data_scope, the available list of CMs changes. This is very important
      # to get correct data.
      #all_cms = User.where(email: [Lead::CM_EMAILS_FOR_AWS_FHI, Lead::CM_EMAILS_FOR_AWS_MKW].flatten)
      all_cms = User.joins(:tags).where(tags: {name: ["mkw", "full_home"]})
      cms_in_scope = User.none
      if filter_params[:data_scope] == "overall_data"
        cms_in_scope = User.joins(:tags).where(tags: {name: ["mkw", "full_home"]})
      elsif filter_params[:data_scope] == "fhi_data"
        cms_in_scope = User.joins(:tags).where(tags: {name: "full_home"})
      elsif filter_params[:data_scope] == "mkw_data"
        cms_in_scope = User.joins(:tags).where(tags: {name: "mkw"})
      end

      # filter by cm, designer, city as applicable.
      if filter_params[:designers].present?
        cm = User.with_role(:designer).where(id: filter_params[:designers]).sample&.cm
        # factor = 1.0 if ( cm.blank? || cm.designers_for_cm.count == 0 )
        number_designers = User.with_role(:designer).where(id: filter_params[:designers]).count
        factor = ( cm.blank? || cm.designers_for_cm.count == 0 ) ? 1.0 : number_designers.to_f/cm.designers_for_cm.count
      elsif filter_params[:cm].present?
        factor = cms_in_scope.where(id: filter_params[:cm]).count
      elsif filter_params[:city].present? && filter_params[:city] != 'all'
        # city = City.find(filter_params[:city])
        cms_for_city = cms_in_scope.joins(:cities).where(cities: {id: filter_params[:city]}).distinct
        factor = cms_for_city.count
      else
        factor = cms_in_scope.count
      end

      # Now the date factor.
      # If no from date, then start from 1 Apr, 2018.
      date_factor = nil
      from_date = filter_params[:from_date].present? ? Date.parse(filter_params[:from_date].to_s) : Date.parse("2018-01-01")
      to_date = filter_params[:to_date].present? ? Date.parse(filter_params[:to_date].to_s) : Date.today
      duration_days = (to_date - from_date).to_i + 1
      if options[:one_week_only] || duration_days <= 0
        date_factor = 1.0
      else
        date_factor = duration_days/7.0
      end

      factor * date_factor
    end

    # No targets for overall data.
    # For other cases, provided data multiplied by the scaling factor.
    def get_aws_target_data(filter_params, options={})
      filter_params ||= {}
      keys_to_scale = [:number_of_leads]
      scaling_factor = aws_target_data_factor(filter_params, options)
      key_name = 'fhi_targets'
      if filter_params[:data_scope] == 'mkw_data'
        key_name = 'mkw_targets'
      elsif filter_params[:data_scope] == 'overall_data'
        keys_to_scale = [:none]
      end

      h = Hash.new
      ARRIVAE_WEEKLY_STATISTICS_DATA[key_name].symbolize_keys.each do |k, v|
        if keys_to_scale.include?(:none)
          h[k] = 0
        elsif keys_to_scale.include?(k)
          h[k] = (v * scaling_factor).round(0)
        else
          h[k] = v
        end
      end

      # Adjust number_of_leads target as per digital or physical
      if filter_params[:digital_physical] == "digital"
        h[:number_of_leads] = h[:number_of_leads] * ARRIVAE_WEEKLY_STATISTICS_DATA[key_name]["digital_leads_percent"]/100.0
      elsif filter_params[:digital_physical] == "physical"
        h[:number_of_leads] = h[:number_of_leads] * ARRIVAE_WEEKLY_STATISTICS_DATA[key_name]["physical_leads_percent"]/100.0
      end

      h
    end

    # Given a target data hash, return the data to be shown in the top cards.
    def aws_dashboard_card_data(target_data)
      collection = self.all
      boqs_shared_array = boq_shared_within(15)
      boqs_shared_in_time_percent = collection.count==0 ? 0 : ((100*boqs_shared_array.count.to_f)/collection.count).round(1)
      project_ids_for_boqs_shared = boqs_shared_array
      # For calculating closure percentage, if no of boqs shared within 15 days is zero, take the base as 1.
      closure_percent_base = project_ids_for_boqs_shared.count==0 ? 1 : project_ids_for_boqs_shared.count
      closure_45_array = collection.closure_within(45, project_ids_for_boqs_shared)
      closure_45_percent = ((100 * closure_45_array.count.to_f)/closure_percent_base).round(1)

      {
        qualified_leads_target: target_data[:number_of_leads],
        qualified_leads_actual: collection.count,
        first_meeting_target: target_data[:first_meeting_7days_percent].to_i,
        first_meeting_actual: collection.first_meeting_within(7).round(1),
        boq_shared_target: target_data[:boqs_shared_15days_percent],
        boq_shared_actual: boqs_shared_in_time_percent,
        closure_target: target_data[:closures],
        closure_actual: closure_45_percent
      }
    end

    # array of data of several weeks
    def aws_dashboard_weekly_data(number_of_weeks, target_data, end_time=nil)
      end_time ||= Time.zone.now
      end_time = end_time.in_time_zone(Time.zone.name)
      this_week_start = end_time.beginning_of_week
      this_week_end = end_time.end_of_week

      arr = []
      (0...number_of_weeks).each do |i|
        week_start_time = this_week_start - i.weeks
        week_end_time = this_week_end - i.weeks
        lead_ids = self.joins(:project).where(projects: { created_at: week_start_time..week_end_time }).pluck(:id).uniq
        collection = Lead.unscoped.where(id: lead_ids)
        arr << {
          week_number: i+1,
          week_start_date: week_start_time.strftime("%b %e"),
          week_end_date: week_end_time.strftime("%b %e"),
          data_hash: collection.aws_dashboard_period_data(week_start_time, week_end_time, target_data)
        }
      end

      arr
    end

    # made for getting the data for a single week, but other time periods can be provided as well.
    def aws_dashboard_period_data(week_start_time, week_end_time, target_data)
      collection = self.all
      boqs_shared_array = boq_shared_within(15)
      boqs_shared_in_time_percent = collection.count==0 ? 0 : ((100*boqs_shared_array.count.to_f)/collection.count).round(1)
      project_ids_for_boqs_shared = boqs_shared_array
      # For calculating closure percentage, if no of boqs shared within 15 days is zero, take the base as 1.
      closure_percent_base = project_ids_for_boqs_shared.count==0 ? 1 : project_ids_for_boqs_shared.count
      closure_45_array = collection.closure_within(45, project_ids_for_boqs_shared)
      closure_45_percent = ((100 * closure_45_array.count.to_f)/closure_percent_base).round(1)

      {
        qualified_leads_target: target_data[:number_of_leads],
        qualified_leads_actual: collection.joins(:project).where(projects: { created_at: week_start_time..week_end_time }).distinct.count,
        first_meeting_target: target_data[:first_meeting_7days_percent].to_i,
        first_meeting_actual: collection.first_meeting_within(7).round(1),
        boq_shared_target: target_data[:boqs_shared_15days_percent],
        boq_shared_actual: boqs_shared_in_time_percent,
        closure_target: target_data[:closures],
        closure_actual: closure_45_percent
      }
    end

    # fhi and mkw weekly tabular data
    def aws_tabular_weekly_data(number_of_weeks, target_data, filter_params)
      end_time = filter_params[:to_date]
      end_time ||= Time.zone.now
      end_time = end_time.in_time_zone(Time.zone.name)
      this_week_start = end_time.beginning_of_week
      this_week_end = end_time.end_of_week
      all_lead_ids = self.pluck(:id).uniq
      #Not just those qualified in given period - ie date filter not applied yet.
      all_filtered_leads = Lead.unscoped.where(id: all_lead_ids)
      # After application of date filter
      filtered_leads = self.filter_date_admin(filter_params)

      arr = []
      (0...number_of_weeks).each do |i|
        week_start_time = this_week_start - i.weeks
        week_end_time = this_week_end - i.weeks
        lead_ids = filtered_leads.joins(:project).where(projects: { created_at: week_start_time..week_end_time }).pluck(:id).uniq
        collection = Lead.unscoped.where(id: lead_ids)
        arr << {
          week_number: i+1,
          week_start_date: week_start_time.strftime("%b %e"),
          week_end_date: week_end_time.strftime("%b %e"),
          data_hash: collection.aws_tabular_period_data(week_start_time, week_end_time, target_data, all_filtered_leads)
        }
      end

      arr
    end

    # made for getting the data for a single week, but other time periods can be provided as well.
    # for FHI and MKW lead tables
    def aws_tabular_period_data(week_start_time, week_end_time, target_data, all_filtered_leads)
      collection = self.all
      qualified_leads_actual = collection.count
      boqs_shared_array = boq_shared_within(15)
      project_ids_for_boqs_shared = boqs_shared_array
      boqs_shared_in_time_count = boqs_shared_array.count
      first_meeting_target = qualified_leads_actual==0 ? 0 : ((target_data[:first_meeting_7days_percent].to_f * qualified_leads_actual)/100)
      boq_shared_target = qualified_leads_actual==0 ? 0 : ((target_data[:boqs_shared_15days_percent].to_f * qualified_leads_actual)/100)
      closure_target = boqs_shared_array.count==0 ? 0 : ((target_data[:closures].to_f * boqs_shared_array.count)/100)
      total_boq_shared = collection.joins(project: [:proposals, :quotations]).where(proposals: { proposal_status: "proposal_shared" }).distinct
      total_boq_shared_count = total_boq_shared.count
      boq_not_shared_within_week = collection.count - total_boq_shared_count
      total_closure_count = collection.joins(project: :payments).where.not(payments: { is_approved: false }).distinct.count
      closure_45_array = collection.closure_within(45, project_ids_for_boqs_shared)
      closure_45_count = closure_45_array.count
      closure_beyond_45_count = total_closure_count - closure_45_array.count
      boq_not_closed_within_week = collection.count - total_closure_count
      # closure_days_acutal = avg_days_closure(project_ids_for_boqs_shared)  #not needed in new design
      first_meeting_7_count = collection.first_meeting_within(7)
      total_successful_first_meeting = collection.joins(project: :events).where(events: {agenda: "first_meeting", status: "done"}).distinct.count
      #ALL filtered leads, not just from the collection
      shared_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: all_filtered_leads}).where(lead_statistics_data: {first_shared_time: week_start_time..week_end_time}).distinct
      leads_boqs_shared_within_week_count = shared_stats.count
      value_of_boq_shared_within_week = shared_stats.sum(:first_shared_value).round(0)
      closure_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: all_filtered_leads}).where(lead_statistics_data: {closure_time: week_start_time..week_end_time}).distinct
      leads_boqs_closure_within_week_count = closure_stats.count
      value_of_boq_closure_within_week = closure_stats.sum(:closure_value).round(0)
      creation_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: all_filtered_leads}).where(lead_statistics_data: {boq_creation_time: week_start_time..week_end_time}).distinct
      leads_boqs_created_within_week_count = creation_stats.count
      value_of_boq_created_within_week = creation_stats.sum(:boq_creation_value).round(0)
      # First BOQs created from within this week's leads ie collection
      this_week_creation_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: collection}).where(lead_statistics_data: {boq_creation_time: week_start_time..week_end_time}).distinct
      leads_boqs_created_within_week_count_limited = this_week_creation_stats.count
      value_of_boq_created_within_week_limited = this_week_creation_stats.sum(:boq_creation_value).round(0)
      {
        qualified_leads_target: target_data[:number_of_leads].round(0),
        qualified_leads_actual: qualified_leads_actual.round(0),
        first_meeting_target: first_meeting_target.round(0),
        first_meeting_actual: first_meeting_7_count,
        meeting_after_7_days: total_successful_first_meeting - first_meeting_7_count,
        boq_shared_target: boq_shared_target.round(0),
        boq_shared_actual: boqs_shared_in_time_count,
        boq_shared_after_15_days: total_boq_shared_count - boqs_shared_array.count,
        boq_shared_within_week: leads_boqs_shared_within_week_count,
        value_of_boq_shared_within_week: MoneyModule.indian_format(value_of_boq_shared_within_week),
        boq_not_shared_within_week: boq_not_shared_within_week,
        boq_created_within_week: leads_boqs_created_within_week_count,
        value_of_boq_created_within_week: MoneyModule.indian_format(value_of_boq_created_within_week),
        boq_created_within_week_limited: leads_boqs_created_within_week_count_limited,
        value_of_boq_created_within_week_limited: MoneyModule.indian_format(value_of_boq_created_within_week_limited),
        closure_target: closure_target.round(0),
        closure_actual: closure_45_count,
        closures_after_45_days: closure_beyond_45_count,
        closure_shared_within_week: leads_boqs_closure_within_week_count,
        boq_not_closed_within_week: boq_not_closed_within_week,
        value_of_closure_shared_within_week: MoneyModule.indian_format(value_of_boq_closure_within_week)
        # closure_days_target: target_data[:number_days_closure], # not used in new design
        # closure_days_acutal: closure_days_acutal.round(0),  # not used in new design
        # avg_boq_value_target: target_data[:avg_boq_value],  #not used in new design
        # avg_boq_value_actual: collection.avg_boq_value_actual, #not used in new design
        # avg_closure_value: collection.avg_closure_value, #not used in new design
      }
    end

    # GM dashboard tabular.
    # type_of_filter can be daily, weekly, monthly OR a date range.
    # number_of_iterations will be ignored for date range as its array will have a single entry only.
    # Start and end dates are to be provided only if the type_of_filter value is 'date_range'.
    def gm_dashboard_tabular_data(number_of_iterations, type_of_filter, options={}, detail_filter={}, all_leads)
      all_lead_ids = self.pluck(:id).uniq
      all_filtered_leads = Lead.unscoped.where(id: all_lead_ids)  #Not just those qualified in given period.

      old_leads_ids = all_leads
      old_leads = Lead.unscoped.where(id: old_leads_ids)

      arr = []
      lead_ids = self.joins(:project).where(projects: {created_at:  options[:start_time]..options[:end_time]}).pluck(:id).uniq
      collection = Lead.unscoped.where(id: lead_ids)
      # Common column
      column_name = "Total"
      if detail_filter.present? && detail_filter[:column] == "Total"
        arr = []
        return arr << collection.gm_dashboard_tabular_period_data(options[:start_time], options[:end_time], all_filtered_leads, detail_filter, old_leads)

      else
        arr << {
          column_title: column_name,
          data_hash: collection.gm_dashboard_tabular_period_data(options[:start_time], options[:end_time], all_filtered_leads,detail_filter, old_leads)
        }
      end
      case type_of_filter
      when 'date_range'
        # Do nothing
      when 'days'
        end_time = Time.zone.now.end_of_day
        (0..number_of_iterations).each do |i|
          period_end_time = end_time - i.days
          period_start_time = period_end_time.beginning_of_day
          lead_ids = all_lead_ids & Project.where(created_at: period_start_time..period_end_time).pluck(:lead_id).uniq
          # lead_ids = self.joins(:project).where(projects: { created_at: period_start_time..period_end_time }).pluck(:id).uniq
          collection = Lead.unscoped.where(id: lead_ids)
          column_name = (Date.today - i.days).to_s
          if detail_filter.present?
            if  detail_filter[:column] == column_name
              arr = []
              return arr << collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            end
          else
            arr << {
              column_title: column_name,
              data_hash: collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            }
          end
        end
      when 'weeks'
        end_time = DateTime.now.end_of_week.end_of_day
        (0..number_of_iterations).each do |i|
          period_end_time = end_time - i.weeks
          period_start_time = period_end_time.beginning_of_week
          lead_ids = all_lead_ids & Project.where(created_at: period_start_time..period_end_time).pluck(:lead_id).uniq
          # lead_ids = self.joins(:project).where(projects: {created_at:  period_start_time..period_end_time}).pluck(:id).uniq
          collection = Lead.unscoped.where(id: lead_ids)
          column_name =  "Week #{i+1} \n #{period_start_time.strftime("%e %b")}.. #{period_end_time.strftime("%e %b")}"
          if detail_filter.present?
            if detail_filter[:column] == column_name
              arr = []
              return arr << collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            end
          else
            arr << {
              column_title: column_name,
              data_hash: collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            }
          end
        end
      when 'months'
        end_time = Time.zone.now.end_of_month
        (0..number_of_iterations).each do |i|
          period_end_time = end_time - i.months
          period_start_time = period_end_time.beginning_of_month
          lead_ids = all_lead_ids & Project.where(created_at: period_start_time..period_end_time).pluck(:lead_id).uniq
          # lead_ids = self.joins(:project).where(projects: { created_at: period_start_time..period_end_time }).pluck(:id).uniq
          collection = Lead.unscoped.where(id: lead_ids)
          column_name = "Month #{i+1} - #{period_start_time.strftime("%B-%y")}"
          if detail_filter.present?
            if detail_filter[:column] == column_name
              arr = []
              return arr << collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            end
          else
            arr << {
              column_title: column_name,
              data_hash: collection.gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter, old_leads)
            }
          end
        end
      end
      arr
    end

    # Made for getting the data for a single day, week, month, or given date range.
    # For GM dashboard.
    def gm_dashboard_tabular_period_data(period_start_time, period_end_time, all_filtered_leads,detail_filter={}, old_leads)
      collection = self.all
      # qualified_leads_actual_count = collection.count
      # all_filtered_leads_count = all_filtered_leads.count
      options = {
        all_filtered_leads: all_filtered_leads,
        # all_filtered_leads_count: all_filtered_leads_count,
        qualified_leads_actual: collection,
        # qualified_leads_actual_count: qualified_leads_actual_count
        old_leads: old_leads
      }
      data_hash = {}
      if detail_filter.present?
        data_hash = gm_dashboard_tabular_data_leads_data(period_start_time, period_end_time, detail_filter, options.merge({data_hash: data_hash}))
      else
        data_hash = gm_dashboard_tabular_period_data_leads(period_start_time, period_end_time, options.merge({data_hash: data_hash}))
        data_hash = gm_dashboard_tabular_period_data_meetings(period_start_time, period_end_time, options.merge({data_hash: data_hash}))
        data_hash = gm_dashboard_tabular_period_data_boqs(period_start_time, period_end_time, options.merge({data_hash: data_hash}))
        data_hash = gm_dashboard_tabular_period_data_closure(period_start_time, period_end_time, options.merge({data_hash: data_hash}))
      end
      return data_hash
    end

    # Leads
    def gm_dashboard_tabular_period_data_leads(period_start_time, period_end_time, options)
      data_hash = options[:data_hash]
      qualified_leads_actual = options[:qualified_leads_actual]
      all_filtered_leads = options[:all_filtered_leads]
      # qualified_leads_actual_count = options[:qualified_leads_actual_count]
      old_leads= options[:old_leads]
      projects = Project.where(lead_id: qualified_leads_actual.pluck(:id))
      assigned_designer = projects.joins(:designer_projects).where(designer_projects: {active: true})
      no_call_24_hrs = ActiveRecord::Base.connection.execute("SELECT lead_id from lead_statistics_data where (DATE_PART('day', lead_statistics_data.designer_first_call - lead_statistics_data.lead_qualification_time)) * 24 + DATE_PART('hours', lead_statistics_data.designer_first_call - lead_statistics_data.lead_qualification_time)  > 24 ")
      no_call_24_hrs = no_call_24_hrs.as_json.map{|v| v["lead_id"]}
      data_hash.merge({
        leads_assigned_cm: qualified_leads_actual.count,
        leads_dropped_cm: qualified_leads_actual.where(lead_status: "dropped").count,
        not_assigned_designer: qualified_leads_actual.count - assigned_designer.count,
        assigned_designer: assigned_designer.count,
        delayed_projects: (qualified_leads_actual.where(lead_status: "delayed_project").pluck(:id) + projects.where(status: "delayed_project").pluck(:lead_id)).uniq.count,
        delayed_possessions: (qualified_leads_actual.where(lead_status: "delayed_possession").pluck(:id) + projects.where(status: "delayed_possession").pluck(:lead_id)).uniq.count,
        designer_not_contactable: projects.where(status: "not_contactable").count,
        designer_lost: projects.where(status: "lost").count,
        no_call_24_hrs: qualified_leads_actual.where(id: no_call_24_hrs).count
      })
    end

    # Meetings
    def gm_dashboard_tabular_period_data_meetings(period_start_time, period_end_time, options)
      data_hash = options[:data_hash]
      qualified_leads_actual = options[:qualified_leads_actual]
      all_filtered_leads = options[:all_filtered_leads]
      old_leads= options[:old_leads]
      clients_met_count = qualified_leads_actual.joins(project: :events).where(events: {status: 'done', agenda: ["first_meeting", "follow_up_meeting", "design_and_boq_presentation"]}).distinct.count

      data_hash.merge({
        clients_met: clients_met_count,
        clients_met_total: old_leads.joins(project: :events).where(events: {status: 'done', agenda: ["first_meeting", "follow_up_meeting", "design_and_boq_presentation"] ,scheduled_at: (period_start_time..period_end_time)}).distinct.count,  #all clients met on header date for the first time.
        clients_not_met: qualified_leads_actual.count - clients_met_count
      })
    end

    # BOQs
    def gm_dashboard_tabular_period_data_boqs(period_start_time, period_end_time, options)
      data_hash = options[:data_hash]
      all_filtered_leads = options[:all_filtered_leads]
      old_leads= options[:old_leads]
      # all_filtered_leads_count = options[:all_filtered_leads_count]
      qualified_leads_actual = options[:qualified_leads_actual]
      # qualified_leads_actual_count = options[:qualified_leads_actual_count]
      all_leads = options[:all_leads]
      # If BOQ is created for a lead, then :boq_creation_time will not be nil
      creation_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {boq_creation_time: nil}).distinct
      value_of_boq_created = creation_stats.sum(:boq_creation_value).round(0)
      creation_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {boq_creation_time: period_start_time..period_end_time}).distinct
      value_of_boq_created_header = creation_stats_header.sum(:boq_creation_value).round(0)

      # If BOQ is shared for a lead, then :first_shared_time will not be nil
      sharing_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {first_shared_time: nil}).distinct
      value_of_boqs_shared = sharing_stats.sum(:first_shared_value).round(0)
      sharing_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {first_shared_time: period_start_time..period_end_time}).distinct
      value_of_boqs_shared_header = sharing_stats_header.sum(:first_shared_value).round(0)

      #select boq created for qualified leads 
      select_boq_value = creation_stats.sum(:boq_shangpin_value).round(0)

      #select boq  created on header date
      select_boq_value_header = creation_stats_header.sum(:boq_shangpin_value).round(0)

      #select boq shared for qualified leads
      select_boq_shared_value = sharing_stats.sum(:boq_shangpin_value).round(0)

      #select boq shared on header date
      select_boq_shared_value_header = sharing_stats_header.sum(:boq_shangpin_value).round(0)

      data_hash.merge({
        boqs_created: creation_stats.count,
        value_of_boqs_created: MoneyModule.indian_format(value_of_boq_created),
        boqs_not_created: qualified_leads_actual.count - creation_stats.count,
        boqs_created_total: creation_stats_header.count,
        value_of_boqs_created_total: MoneyModule.indian_format(value_of_boq_created_header),
        boqs_shared: sharing_stats.count,
        value_of_boqs_shared: MoneyModule.indian_format(value_of_boqs_shared),
        boqs_not_shared: qualified_leads_actual.count - sharing_stats.count,
        boqs_shared_total: sharing_stats_header.count,
        value_of_boqs_shared_total: MoneyModule.indian_format(value_of_boqs_shared_header),
        select_boq_value: MoneyModule.indian_format(select_boq_value),
        select_boq_value_header: MoneyModule.indian_format(select_boq_value_header),
        select_boq_shared_value: MoneyModule.indian_format(select_boq_shared_value),
        select_boq_shared_value_header: MoneyModule.indian_format(select_boq_shared_value_header),
        discount_approval_pending: qualified_leads_actual.joins(project: :quotations).where(quotations: {discount_status: "proposed_for_discount"}).count,
        payment_approval_pending: qualified_leads_actual.joins(project: :payments).where(payments: {is_approved: nil}).pluck(:lead_id).count
      })
    end
    
    #calculate the shangpin job amount of boq based on leads
    # def calculate_shangpin_amount_leads(lead_ids)
    #   projects = Project.includes(quotations: :shangpin_jobs).where(lead_id: lead_ids)
    #   shangpin_value  = 0
    #   projects.each do |project|
    #     if project.quotations&.first&.shangpin_jobs&.present?
    #       shangpin_value += project.quotations.order(created_at: :asc).first.shangpin_amount.to_f
    #     end 
    #   end
    #   shangpin_value.round(0)
    # end

    # Closure
    def gm_dashboard_tabular_period_data_closure(period_start_time, period_end_time, options)
      data_hash = options[:data_hash]
      all_filtered_leads = options[:all_filtered_leads]
      qualified_leads_actual = options[:qualified_leads_actual]
      old_leads= options[:old_leads]
      # qualified_leads_actual_count = options[:qualified_leads_actual_count]
      # all_filtered_leads_count = options[:all_filtered_leads_count]

      # If BOQ is closed for a lead, then :closure_time will not be nil
      closure_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {closure_time: nil}).distinct
      value_of_boqs_closed = closure_stats.sum(:closure_value).round(0)
      closure_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {closure_time: period_start_time..period_end_time}).distinct
      value_of_boqs_closed_header = closure_stats_header.sum(:closure_value).round(0)
      
      select_closer_value = closure_stats.sum(:closer_shangpin_value).round(0)
      select_closer_value_header = closure_stats_header.sum(:closer_shangpin_value).round(0)

      data_hash.merge({
        closures: closure_stats.count,
        value_of_closures: MoneyModule.indian_format(value_of_boqs_closed),
        closures_total: closure_stats_header.count,
        value_of_closures_total: MoneyModule.indian_format(value_of_boqs_closed_header),
        select_closer_value: MoneyModule.indian_format(select_closer_value),
        select_closer_value_header: MoneyModule.indian_format(select_closer_value_header)
      })
    end
    
    # this function calculate closer values for boqs where shangpin jobs are present
    # def calculate_select_closer_value(lead_ids)
    #   projects = Project.includes(:payments).where(lead_id: lead_ids)
    #   closer_value  = 0
    #   projects.each do |project|
    #     payments = project.payments.select{|payment| [true, nil].include? payment.is_approved and payment.payment_type == "initial_design"}
    #     quotations  = Quotation.joins(:payments).where(payments: {id: payments.pluck(:id)}).where(parent_quotation_id: nil).distinct
    #     closer_value += quotations.pluck(:shangpin_amount).compact.sum
    #   end
    #   return closer_value.round(0)
    # end 

    def gm_dashboard_tabular_data_leads_data(period_start_time, period_end_time,detail_filter, options)
      data_hash = options[:data_hash]
      qualified_leads_actual = options[:qualified_leads_actual]
      all_filtered_leads = options[:all_filtered_leads]
      old_leads= options[:old_leads]

      projects = Project.where(lead_id: qualified_leads_actual.pluck(:id))
      assigned_designer = projects.joins(:designer_projects).where(designer_projects: {active: true})

      no_call_24_hrs = ActiveRecord::Base.connection.execute("SELECT lead_id from lead_statistics_data where (DATE_PART('day', lead_statistics_data.designer_first_call - lead_statistics_data.lead_qualification_time)) * 24 + DATE_PART('hours', lead_statistics_data.designer_first_call - lead_statistics_data.lead_qualification_time)  > 24 ")
      no_call_24_hrs = no_call_24_hrs.as_json.map{|v| v["lead_id"]}
      clients_met_leads = qualified_leads_actual.joins(project: :events).where(events: {status: 'done', agenda: ["first_meeting", "follow_up_meeting", "design_and_boq_presentation"]}).distinct

      creation_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {boq_creation_time: nil}).distinct
      value_of_boq_created = creation_stats
      creation_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {boq_creation_time: period_start_time..period_end_time}).distinct
      value_of_boq_created_header = creation_stats_header

      sharing_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {first_shared_time: nil}).distinct
      value_of_boqs_shared = sharing_stats
      sharing_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {first_shared_time: period_start_time..period_end_time}).distinct
      value_of_boqs_shared_header = sharing_stats_header

      closure_stats = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: qualified_leads_actual}).where.not(lead_statistics_data: {closure_time: nil}).distinct
      value_of_boqs_closed = closure_stats
      closure_stats_header = LeadStatisticsDatum.joins("INNER JOIN leads on lead_statistics_data.lead_id=leads.id").where(leads: {id: old_leads}).where(lead_statistics_data: {closure_time: period_start_time..period_end_time}).distinct
      value_of_boqs_closed_header = closure_stats_header

      column_name = detail_filter[:row]
      case column_name
      when "leads_assigned_cm"
        data =  qualified_leads_actual
      when "leads_dropped_cm"
        data =  qualified_leads_actual.where(lead_status: "dropped")
      when "not_assigned_designer"
        data = (qualified_leads_actual.pluck(:id) - assigned_designer.pluck(:lead_id)).uniq
        data =  Lead.unscoped.where(id: data)
      when "assigned_designer"
        data =  Lead.unscoped.where(id: assigned_designer.pluck(:lead_id))
      when "delayed_projects"
        data =  Lead.unscoped.where(id: (qualified_leads_actual.where(lead_status: "delayed_project").pluck(:id) + projects.where(status: "delayed_project").pluck(:lead_id)).uniq)
      when "delayed_possessions"
        data = Lead.unscoped.where(id: (qualified_leads_actual.where(lead_status: "delayed_possession").pluck(:id) + projects.where(status: "delayed_possession").pluck(:lead_id)).uniq)
      when "designer_not_contactable"
        data = Lead.unscoped.where(id: projects.where(status: "not_contactable").pluck(:lead_id))
      when "designer_lost"
        data = Lead.unscoped.where(id: projects.where(status: "lost").pluck(:lead_id))
      when "no_call_24_hrs"
        data = qualified_leads_actual.where(id: no_call_24_hrs)
      when "clients_met"
        data = clients_met_leads
      when "clients_met_total"
        data = old_leads.joins(project: :events).where(events: {status: 'done', agenda: ["first_meeting", "follow_up_meeting", "design_and_boq_presentation"] ,scheduled_at: (period_start_time..period_end_time)}).distinct
      when "clients_not_met"
        data =  Lead.unscoped.where(id: (qualified_leads_actual&.uniq&.pluck(:id) - clients_met_leads&.uniq&.pluck(:id)))
      when "boqs_created"
        data =  Lead.unscoped.where(id: creation_stats.pluck(:lead_id))
      when "value_of_boqs_created"
        data =  Lead.unscoped.where(id: creation_stats.pluck(:lead_id))
      when "boqs_not_created"
        data = Lead.unscoped.where(id: (qualified_leads_actual.pluck(:id) -  creation_stats.pluck(:lead_id)))
      when "boqs_created_total"
        data = Lead.unscoped.where(id: creation_stats_header.pluck(:lead_id))
      when "value_of_boqs_created_total"
        data = Lead.unscoped.where(id: creation_stats_header.pluck(:lead_id))
      when "boqs_shared"
        data = Lead.unscoped.where(id: sharing_stats.pluck(:lead_id))
      when "value_of_boqs_shared"
        data = Lead.unscoped.where(id: sharing_stats.pluck(:lead_id))
      when "boqs_not_shared"
        data = Lead.unscoped.where(id: (qualified_leads_actual.pluck(:id) - sharing_stats.pluck(:lead_id)))
      when "boqs_shared_total"
        data = Lead.unscoped.where(id: sharing_stats_header.pluck(:lead_id))
      when "value_of_boqs_shared_total"
        data = Lead.unscoped.where(id: sharing_stats_header.pluck(:lead_id))
      when "discount_approval_pending"
        data = qualified_leads_actual.joins(project: :quotations).where(quotations: {discount_status: "proposed_for_discount"})
      when "payment_approval_pending"
        data = qualified_leads_actual.joins(project: :payments).where(payments: {is_approved: false})
      when "closures"
        data = Lead.unscoped.where(id: closure_stats.pluck(:lead_id))
      when "value_of_closures"
        data = Lead.unscoped.where(id: closure_stats.pluck(:lead_id))
      when "closures_total"
        data = Lead.unscoped.where(id: closure_stats_header.pluck(:lead_id))
      when "value_of_closures_total"
        data = Lead.unscoped.where(id: closure_stats_header.pluck(:lead_id))
      end
      return data
    end

    def first_meeting_within(duration_days)
      duration_in_hours = duration_days * 24
      total_count = self.count
      project_ids = Project.joins(
        "INNER JOIN leads ON projects.lead_id = leads.id
         INNER JOIN tags ON leads.tag_id = tags.id").
        where(leads: {id: self.all}).pluck(:id).uniq
      return 0.0 unless project_ids.count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT project_id, first_meeting_time FROM (
          SELECT projects.id AS project_id, (DATE_PART('day', event_first_meeting.scheduled_at - projects.created_at) * 24 + DATE_PART('hour', event_first_meeting.scheduled_at - projects.created_at)) AS first_meeting_time
          FROM projects JOIN (
            SELECT * FROM events
            WHERE id IN (
              SELECT MIN(id)
              FROM events
              WHERE agenda = 'first_meeting' AND status = 'done' AND ownerable_type = 'Project'
              GROUP BY ownerable_id
            )
          ) AS event_first_meeting
          ON projects.id = event_first_meeting.ownerable_id
          WHERE projects.id IN (#{project_ids.join(",")})
        ) AS x
        WHERE first_meeting_time <= #{duration_in_hours};"
      )
       return (result.count)
      #return (result.count.to_f/total_count) * 100.0
    end

    def boq_shared_within(duration_days)
      duration_in_hours = duration_days * 24
      lead_ids = self.pluck(:id).uniq
      # total_count = self.count
      # manual joins because of ActiveRecord bug
      # project_ids = Project.joins(
      #   "INNER JOIN leads ON projects.lead_id = leads.id
      #    INNER JOIN tags ON leads.tag_id = tags.id").
      #   joins(quotations: :proposals).
      #   where(leads: {id: self.all}).
      #   where(proposals: { proposal_status: "proposal_shared" }).
      #   pluck(:id).uniq
      lead_statistics_data_ids = LeadStatisticsDatum.where(lead_id: lead_ids).pluck(:id)
      return [] unless lead_statistics_data_ids.count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT lead_stat_id, first_shared_duration FROM (
          SELECT lead_statistics_data.id AS lead_stat_id, (DATE_PART('day', lead_statistics_data.first_shared_time - lead_statistics_data.lead_qualification_time) * 24 + DATE_PART('hour', lead_statistics_data.first_shared_time - lead_statistics_data.lead_qualification_time)) AS first_shared_duration
          FROM lead_statistics_data
          WHERE lead_statistics_data.id IN (#{lead_statistics_data_ids.join(",")})
          ) AS x
          WHERE x.first_shared_duration <= #{duration_in_hours};"
      )

      eligible_lead_statistics_ids = result.map{|t| t['lead_stat_id']}
      # project_ids = Project.joins(lead: :lead_statistics_datum).where(lead_statistics_data: {id: eligible_lead_statistics_ids}).pluck(:id)

      project_ids = Project.joins("INNER JOIN leads on projects.lead_id=leads.id
        INNER JOIN lead_statistics_data ON lead_statistics_data.lead_id=leads.id").
        where(lead_statistics_data: {id: eligible_lead_statistics_ids}).pluck(:id)
      # return (result.count.to_f/total_count) * 100
      project_ids
    end

    # closure is said to occur when the first payment is added.
    def closure_within(duration_days, project_ids)
      duration_in_hours = duration_days * 24
      total_count = project_ids.count
      # project_ids = Project.joins(
      #   "INNER JOIN leads ON projects.lead_id = leads.id
      #    INNER JOIN tags ON leads.tag_id = tags.id").
      #   where(leads: {id: self.all}).pluck(:id).uniq
      return [] unless total_count > 0

      result = ActiveRecord::Base.connection.execute(
        "SELECT project_id, closure_time FROM (
          SELECT projects.id AS project_id, (DATE_PART('day', first_payment.created_at - projects.created_at) * 24 + DATE_PART('hour', first_payment.created_at - projects.created_at)) AS closure_time
          FROM projects JOIN (
            SELECT * FROM payments
            WHERE (is_approved != false)
            AND id IN (
              SELECT MIN(id)
              FROM payments
              GROUP BY project_id
            )
          ) AS first_payment
          ON projects.id = first_payment.project_id
          WHERE projects.id IN (#{project_ids.join(",")})
        ) AS x
        WHERE closure_time <= #{duration_in_hours};"
      )

      # return (result.count.to_f/total_count) * 100
      result
    end

    # the average number of days for closure to take place
    def avg_days_closure(project_ids)
      return 0 unless project_ids.count > 0
      result = ActiveRecord::Base.connection.execute(
        "SELECT AVG(payments.created_at - projects.created_at) AS avg_time_to_closure
        FROM projects
        JOIN payments
        ON payments.project_id = projects.id
        WHERE projects.id IN (#{project_ids.join(",")})"
        )

      avg_time = result[0]["avg_time_to_closure"]
      return 0 unless avg_time.present?
      str = avg_time.include?('day') ? 'day' : 'days'
      arr = avg_time.split(str)
      if arr.size == 1  #case where it is less than a day
        return TimeModule.time_to_hours(arr.last.strip)/24.0
      else
        return arr[0].strip.to_f + TimeModule.time_to_hours(arr[1].strip)/24.0
      end
    end

    def avg_boq_value_actual
      # quotations = Quotation.joins(project: [{quotations: :proposals}, :lead]).where(leads: {id: lead_ids}).
      #   where(proposals: { proposal_status: "proposal_shared" }).distinct
      # quotations.average(:total_amount).to_i

      # doing this weird roundabout way because of the ActiveRecord bug which is generating wrong query.
      project_ids = Project.joins(
        "INNER JOIN leads ON projects.lead_id = leads.id
         INNER JOIN tags ON leads.tag_id = tags.id").
        where(leads: {id: self.all}).
        pluck(:id).uniq
      quotations = Quotation.joins(project: [{quotations: :proposals}]).
        where(projects: {id: project_ids})
        where(proposals: { proposal_status: "proposal_shared" }).distinct
      quotations.average(:total_amount).to_i
    end

    def avg_closure_value
      # lead_ids = self.all.map(&:id)
      # quotations = Quotation.joins(project: [{quotations: [:proposals, :payments]}, :lead]).where(leads: {id: lead_ids}).
      #   where(proposals: { proposal_status: "proposal_shared" }).distinct
      # quotations.average(:total_amount).to_i

      # doing this weird roundabout way because of the ActiveRecord bug which is generating wrong query.
      project_ids = Project.joins(
        "INNER JOIN leads ON projects.lead_id = leads.id
         INNER JOIN tags ON leads.tag_id = tags.id").
        where(leads: {id: self.all}).
        pluck(:id).uniq
      quotations = Quotation.joins(project: [{quotations: [:proposals, :payments]}]).
        where(projects: {id: project_ids})
        where(proposals: { proposal_status: "proposal_shared" }).distinct
      quotations.average(:total_amount).to_i
    end
  end
end
