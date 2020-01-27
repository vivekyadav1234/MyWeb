require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"
require "google/cloud/firestore"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ThorApi
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.time_zone = 'Asia/Kolkata'
    config.enable_dependency_loading = true
    config.autoload_paths << "#{Rails.root}/lib"
    config.api_only = true
    config.middleware.use Rack::Attack
    config.active_job.queue_adapter = :delayed_job
    config.generators do |g|
      g.stylesheets false
      g.test_framework false
      g.helper false
      g.assets false
      g.view_specs false
    end

    Google::Cloud::Firestore.configure do |config|
      config.project_id  = "arrivae-lead-app"
      config.credentials = "#{Rails.root}/config/arrivae_lead_app_firestore.json"
    end
    # config.middleware.insert_before 0, "Rack::Cors" do
    #   allow do
    #     origins '*'
    #     resource '*', :headers => :any, :methods => [:get, :post, :options]
    #   end
    # end
  end
end
