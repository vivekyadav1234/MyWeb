namespace :fb_lead do
  task fetch_lead: :environment do
    if Rails.env.production?
      FbModule::ManualLeadImport.new.get_leads_from_fb
    else
      puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      puts "FB import script was not run because it is configured to run only in production environment. Current envirenoment is #{Rails.env}."
      puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    end
  end
end
