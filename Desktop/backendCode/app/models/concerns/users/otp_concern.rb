# This module containes methods related to Csagents. This will prevent the User class from being bloated.
module Users::OtpConcern
  extend ActiveSupport::Concern

  included do
    has_one_time_password column_name: :otp_secret_key, length: 6
  end

end