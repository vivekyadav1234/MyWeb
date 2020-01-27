class CreateMissingProjectJob < ApplicationJob
  queue_as :default

  include ScriptModule

  def perform(*args)
    create_project_for_leads
    # if Rails.env.production?
    #   UserNotifierMailer.test_email_utility.deliver!
    # end
  end
end
