Rails.application.configure do
  #Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.
  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = true

  # Do not eager load code on boot.
  config.eager_load = true

  # Show full error reports.
  config.consider_all_requests_local = true
  config.debug_exception_response_format = :api
  config.reload_classes_only_on_change = true
  # Enable/disable caching. By default caching is disabled.
  if ENV['REDIS_URL']
    config.action_controller.perform_caching = true
    config.cache_store = :redis_store, ENV['REDIS_URL']
  else
    config.action_controller.perform_caching = true
    config.cache_store = :memory_store, { size: 128.megabytes }
  end

  # to ensure we get full logs to STDOUT in fe_dev environment
  logger           = ActiveSupport::Logger.new(STDOUT)
  logger.formatter = config.log_formatter
  config.logger = ActiveSupport::TaggedLogging.new(logger)
  config.log_level = :debug

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_deliveries = true

  #URL of the frontend for this environment. Will be used in some mails.
  config.frontend_site_url = 'http://localhost:4200'

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  #URL of the frontend for this environment. Will be used in some mails.
  config.frontend_site_url = 'http://localhost:4200'

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = { address: 'localhost', port: 1025 }
  config.action_mailer.default_url_options = { :host => 'localhost', port: '3000' }
  #paperclip S3
  config.paperclip_defaults = {
    storage: :s3,
    s3_region: ENV["AWS_REGION"],
    s3_credentials: {
      s3_host_name: ENV["AWS_S3_HOST_NAME"],
      bucket: ENV["AWS_S3_BUCKET"],
      access_key_id: ENV["AWS_ACCESS_KEY_ID"],
      secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"]
      }
    }
  Paperclip.options[:command_path] = "/usr/local/bin/"
end
