class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include ActionController::Serialization
  include ExceptionHandler
  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from CanCan::AccessDenied do |exception|
    if user_signed_in?
      if current_user.is_active?
        render json: { message: "You don't have the permission to perform this action.", access: false }, status: :forbidden
      else
        render json: { message: "Your account has been disabled.", access: false }, status: :forbidden
      end
    else
      render json: { message: "You need to be logged in." , access: false }, status: :unauthorized
    end
  end

  def require_admin
    unless user_signed_in? && current_user.has_role?(:admin)
      render json: {message: "Access Denied."}, status: :unauthorized
    end
  end

  def blog
    redirect_to "https://arrivae.com/blog#{request.fullpath.gsub('/blog','')}", :status => :moved_permanently
  end

  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :contact, :role])
  end
end
