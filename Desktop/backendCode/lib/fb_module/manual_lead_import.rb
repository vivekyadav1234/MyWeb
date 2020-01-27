# Everything done here was using credentials from the FB account roshnimalik@arrivae.com
class FbModule::ManualLeadImport
  include FbModule::CommonModule

  def initialize

  end

  def get_leads_from_fb
    last_run = JobHistory.where(job_type: "fetch_leads", job_name: "fb_lead").last
    lead_initial = Lead.count
    time_ago = 30.days.ago.in_time_zone('GMT').to_i
    begin
      fetch_leads(nil, time_ago)
      leads_after_script_run = Lead.count
      info = "#{leads_after_script_run - lead_initial} leads are added"
      JobHistory.create!(job_type: "fetch_leads", job_name: "fb_lead", run_at: DateTime.now, info: info)
    rescue StandardError => e
      JobStatusMailer.failed_job_info_to_dev_team(e, "fb_lead").deliver_now!
    end
  end

  def check_for_failed_job
    job_histories = JobHistory.where(job_type: "fetch_leads", job_name: "fb_lead").where("created_at > ?", 1.day.ago)
    if job_histories.count < 20
      run_at_array = job_histories.map{|job| job.run_at.to_i}
      diff_arr = run_at_array.each_cons(2).map { |a,b|  b-a > 10800 ? true : false }.uniq
      if diff_arr.include?(true) || diff_arr.blank?
        begin
          lead_initial = Lead.count
          fetch_leads(nil, 30.days.ago.in_time_zone('GMT').to_i)
          leads_after_script_run = Lead.count
          info = "#{leads_after_script_run - lead_initial} leads are added"
          JobHistory.create!(job_type: "fetch_leads", job_name: "check_for_failed_job", run_at: DateTime.now, info: info)
        rescue StandardError => e
          JobStatusMailer.failed_job_info_to_dev_team(e, "check_for_failed_job").deliver_now!
        end
      end
    end
  end

  def fetch_leads(url=nil, time_ago = 30.days.ago.in_time_zone('GMT').to_i)
    # byebug
    url = url.present? ? url : "#{API_BASE_URL}/v#{API_VERSION}/1947981418749602/leadgen_forms?access_token=#{PERMANENT_TOKEN}&limit=#{LIMIT_PER_PAGE}"
    response = api_call(url)
    r_body =  JSON.parse(response.body)
    time_ago = time_ago # Time in unix format. 6 hours ago in gmt 
    form_data = r_body["data"]
    exceptions = []
    form_data.each do |data|
      begin
        # Import only from forms that fulfill following conditions:
        # 1. status must be ACTIVE
        # 2. Forms must not be those that are to be skipped (found in :forms_to_skip)
        if data["status"] == "ACTIVE" && !forms_to_skip.values.include?(data['id'].to_i)
          add_lead(data["id"], data["name"], time_ago)
        end
      rescue StandardError => e
        exceptions << e
        next
      end
    end
    if r_body["paging"]["next"].present?
      url = r_body["paging"]["next"]
      fetch_leads(url, time_ago)
    end
    if exceptions.present?
      raise exceptions[0]
    end
  end

  protected

  def add_lead(form_id, form_name, unix_time,url=nil)
    url = url.present? ? url : "#{API_BASE_URL}/v#{API_VERSION}/#{form_id}/leads?access_token=#{PERMANENT_TOKEN}&limit=#{LIMIT_PER_PAGE}&fields=created_time,id,ad_id,form_id,field_data,campaign_name"
    filter_on_created_time = "&filtering=[{'field':'time_created','operator':'GREATER_THAN','value':'#{unix_time}'}]" #filter is added on time_created
    url_with_time_filter = url+filter_on_created_time
    response = api_call(url_with_time_filter)
    r_body =  JSON.parse(response.body)
    leads = r_body["data"]
    if leads.present?
      campaign = LeadCampaign.where(name: leads.first["campaign_name"]).first_or_create
      lead_source = LeadSource.where(name: "digital_marketing").first_or_create
      type = LeadType.find_by(name: 'customer')
      leads.each_with_index do |lead, i|
        hash = Hash.new
        field_data = lead["field_data"]
        field_data.map{|f| hash[f["name"]] = f["values"].first}
        formatted_phone_number = Lead.format_contact(hash['phone_number'])
        unless Lead.find_by(contact: formatted_phone_number).present?
          if formatted_phone_number.present?
            l = Lead.create!(contact: formatted_phone_number, name: hash["full_name"], lead_source: lead_source, lead_campaign: campaign, lead_type: type)
            l.update!(email: hash["email"]) if hash["email"].present?
          end
        end
      end
    end
    if r_body.present? && r_body["paging"].present? && r_body["paging"]["next"].present?
      url = r_body["paging"]["next"]
      add_lead(form_id,form_name, unix_time, url)
    end
  end
end
