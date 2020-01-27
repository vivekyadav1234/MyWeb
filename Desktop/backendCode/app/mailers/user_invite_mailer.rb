class UserInviteMailer < ApplicationMailer
  default from: 'wecare@arrivae.com'

  def invite_user(user)
    @user = user
    mail(to: @user.email, subject: " Welcome Your are invited")
  end
end
