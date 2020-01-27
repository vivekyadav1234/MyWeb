Devise.setup do |config|
  # Using rails-api, tell devise to not use ActionDispatch::Flash
  # middleware b/c rails-api does not include it.

  #config.sign_in_after_reset_password = false

  config.navigational_formats = [:json]
  config.mailer_sender = "wecare@arrivae.com"
  config.secret_key = '86f5e054f11e423d7ad19e58171baeed17176adb9d6287e92459cf4ef5f0fc0a63e20320600957025c8bf49132c6dedb6e02a3f71e6eb6df7d844c4bfcab3bb2'
end
