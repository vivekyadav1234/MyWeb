class CmDesignerLeadsJob < ApplicationJob
  queue_as :default

  def perform(lead_ids, user_role,user)
  	lead_excel = Lead.leads_download_xlsx(lead_ids,user_role,user)
  	UserNotifierMailer.lead_list_email(lead_excel[:filepath], lead_excel[:file_name], user).deliver_now
  end
end