# DANGER! This locks out ALL users whose id is provided. You probably only want this when absolutely necessary.
class PasswordResetJob < ApplicationJob
  # queue_as :report_mailer

  def perform(user_ids, options={})
    User.where(id: user_ids).find_each do |user|
      # Generate random, long password that the user will never know:
      if options[:expire_password]
        new_password = Devise.friendly_token(50)
        user.reset_password(new_password, new_password)
        user.tokens = nil
        user.save!
      end

      # Send instructions so user can enter a new password:
      UserNotifierMailer.manual_password_reset_mail(user).deliver
    end
    
    UserNotifierMailer.manual_password_reset_dev_mail(user_ids).deliver
  end
end
