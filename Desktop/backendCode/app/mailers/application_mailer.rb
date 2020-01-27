class ApplicationMailer < ActionMailer::Base
  default from: 'wecare@arrivae.com'
  layout 'mailer'
  before_action :set_frontend_root_url

  def set_frontend_root_url
    @frontend_root_url = Rails.application.config.frontend_site_url
  end
end
