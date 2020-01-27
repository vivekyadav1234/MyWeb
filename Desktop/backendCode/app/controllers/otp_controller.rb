class OtpController < ApplicationController

  def generate_otp
    email = params[:email]
    @user = User.find_by_email(email)
    if @user.present? &&  @user.has_any_role?(:customer, :designer, :community_manager, :city_gm, :design_manager, :business_head) && @user.contact.present?
      @user.otp_regenerate_secret
      @user.save!
      otp = @user.otp_code
      SmsModule.send_sms("Use #{otp} as your login OTP. OTP is confidential. Arrivae never calls you asking for OTP. Sharing it with anyone gives them full access to your Arrivae account. If you did not request an OTP, then you can safely ignore this message.", @user&.contact)
      last_three_numbers = "XXXXXXX"+(@user&.contact.split(//).last(3).join("").to_s)
      render json: { message: "An OTP has been sent to your registered mobile number - #{last_three_numbers}. Please enter the  OTP to login."}, status: 200
    else
      render json: { message: "There is no user with this email."}, status: 404
    end
  end

  def otp_based_login
    email = params[:email]
    otp = params[:otp]
    @user = User.find_by_email(email)
    begin
      if @user.present? && @user.authenticate_otp(otp, drift: 300) &&  @user.has_any_role?(:customer, :designer, :community_manager, :city_gm, :design_manager, :business_head)
        sign_in(:api_v1_user, @user)
        new_auth_header = @user.create_new_auth_token()
        response.headers.merge!(new_auth_header)
        headers = response.headers
        render json: { user: @user, headers: headers}, status: 200
      else
        if @user.blank?
          render json: { message: "There is no user with this email."}, status: 404
        else
          render json: { message: "OTP is expired or incorrect."}, status: 401
        end
      end
    rescue StandardError => e
      ExceptionNotifier.notify_exception(e, env: request.env)
      render json: { message: "Something went wrong. Please try again."}, status: 500
    end
  end
end
