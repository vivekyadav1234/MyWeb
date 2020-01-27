# This module contains the methods required to process the data sent to us by FB (to our webhooks end-point).
# It has been originally made to process leads coming from FB, but can be expanded to others later, if needed.
# Please keet this modular!
module FbModule::WebhookProcessingModule
  include FbModule::CommonModule

  # In the 'changes' array, we will look for the 'field' value. Based on the value, we will call the appropriate method.
  def process_page_data(rbody)
    return false unless is_page_object?(rbody)
    rbody = rbody.with_indifferent_access
    rbody[:entry].each do |entry_hash|
      entry_hash[:changes].each do |change|
        if change[:field] == 'leadgen'
          # change[:value] will of following form for 'leadgen':
          # {"ad_id"=>"23842689699100687",
          #  "form_id"=>"872906979555833",
          #  "leadgen_id"=>"1341720996007760",
          #  "created_time"=>1569565233,
          #  "page_id"=>"1947981418749602",
          #  "adgroup_id"=>"23842689699100687"}
          fb_leadgen = save_leadgen_data(change)
          # process leadgen data and create lead only if the form is not set to be skipped.
          get_leadgen_data(change[:value][:leadgen_id], { fb_leadgen_id: fb_leadgen.id }) unless forms_to_skip.values.include?(change[:value][:form_id].to_i)
        end
      end      
    end
  end

  def save_leadgen_data(change_hash)
    fb_leadgen = FbLeadgen.new(
      leadgen_id: change_hash[:value][:leadgen_id],
      form_id: change_hash[:value][:form_id],
      ad_id: change_hash[:value][:ad_id],
      page_id: change_hash[:value][:page_id],
      adgroup_id: change_hash[:value][:adgroup_id],
      field: change_hash[:field],
      fb_payload_body: change_hash
      )
    fb_leadgen.fb_created_time = ( change_hash[:value][:created_time].to_i > 0 ) ? Time.at(change_hash[:value][:created_time].to_i) : nil
    fb_leadgen.save!
    fb_leadgen
  end

  # get lead data, given leadgen_id
  # options can contain the id of the fb_leadgen record which is to be mapped to this lead.
  def get_leadgen_data(leadgen_id, options={})
    # byebug
    if options[:fb_leadgen_id].present?
      fb_leadgen = FbLeadgen.find(options[:fb_leadgen_id])
    end
    api_url = get_leadgen_url(leadgen_id)
    response = api_call(api_url)
    r_body =  JSON.parse(response.body)
    data = r_body
    field_data_hash = Hash.new
    field_data = data["field_data"]
    field_data.map{|f| field_data_hash[f["name"]] = f["values"].first}
    formatted_phone_number = Lead.format_contact(field_data_hash['phone_number'])
    fb_leadgen.update!(contact: formatted_phone_number)
    @lead_source = LeadSource.where(name: "digital_marketing").first_or_create
    @lead_type = LeadType.find_by(name: 'customer')
    campaign = LeadCampaign.where(name: data["campaign_name"]).first_or_create
    unless Lead.find_by(contact: formatted_phone_number).present?
      if formatted_phone_number.present?
        lead = Lead.new(
          contact: formatted_phone_number,
          name: field_data_hash["full_name"],
          lead_source: @lead_source,
          lead_campaign: campaign,
          lead_type: @lead_type
          )
        lead.email = field_data_hash["email"] if field_data_hash["email"].present?
        lead.city = field_data_hash["city"] if field_data_hash["city"].present?
        if lead.save!
          fb_leadgen.update(lead: lead)
        end
      end
    end
  end

  # fb api call url
  def get_leadgen_url(leadgen_id)
    "#{API_BASE_URL}/v#{API_VERSION}/#{leadgen_id}?access_token=#{PERMANENT_TOKEN}&fields=created_time,id,ad_id,form_id,field_data,campaign_name"
  end

  private
  # Check that the ping contains a 'page' object.
  def is_page_object?(rbody)
    rbody = rbody.with_indifferent_access
    rbody[:object] == 'page'
  end
end
