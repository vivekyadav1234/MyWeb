class RegistrationsController < DeviseTokenAuth::RegistrationsController


  def create
    @user = User.new(user_params)
    begin
      @user.save!
      if params[:role] == "designer"
        @user.add_role :designer
      elsif params[:role] == "agent"
        @user.add_role :agent
      else
        @user.add_role :customer
      end
      render json: @user, status: :created, location: v1_user_url(@user)
    rescue => error
      render json: {message: error.message.sub('Validation failed: ', '')}, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:name, :role, :contact, :email, :password, :password_confirmation)
  end

end
