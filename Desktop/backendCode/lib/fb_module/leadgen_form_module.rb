# This module contains the functionality for getting data from and to making changes to specific leadgen forms.
module FbModule::LeadgenFormModule
  include FbModule::CommonModule

  # form_ids must be an array of leadgen form ids.
  def change_archive_status_mass(form_ids, status)
    success_ids = []
    failed_ids = []
    form_ids.each do |form_id|
      r_body = change_archive_status(form_id, status)
      if r_body['success']
        success_ids << form_id
      else
        failed_ids << {
          id: form_id,
          r_body: r_body
        }
      end
    end

    {
      success: success_ids,
      failure: failed_ids
    }
  end

  def change_archive_status(form_id, status)
    change_form_status_api_call(form_id, status, true)
  end

  def get_leadgen_questions(form_id, make_call=true)
    api_url = "#{API_BASE_URL}/v#{API_VERSION}/#{form_id}?access_token=#{PERMANENT_TOKEN}&fields=questions"
    puts "Making API call to end-point:"
    puts "#{api_url}"
    response = api_call(api_url)
    r_body =  JSON.parse(response.body)
    puts r_body
    r_body
  end

  # change the status of a leadgen form
  def change_form_status_api_call(form_id, status, make_call=true)
    api_url = "#{API_BASE_URL}/v#{API_VERSION}/#{form_id}?access_token=#{PERMANENT_TOKEN}&status=#{status}"
    puts "Making API call to end-point:"
    puts "#{api_url}"
    response = api_call(api_url, 'post')
    r_body =  JSON.parse(response.body)
    puts r_body
    r_body
  end
end
