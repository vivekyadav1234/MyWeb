# app/controllers/concerns/exception_handler.rb
module ExceptionHandler
  # provides the more graceful `included` method
  extend ActiveSupport::Concern

  included do
    unless Rails.env.development? || Rails.env.fe_dev?
      rescue_from ::ActiveRecord::RecordNotFound, with: :render_404

      rescue_from ActiveRecord::RecordInvalid do |e|
        render json: {message: e.message}, status: :unprocessable_entity
      end

      rescue_from ActionController::ParameterMissing do |e|
        render json: {message: e.message}, status: 400
      end
    end

    def render_404
      render json: {message: "Record not found"}, status: :not_found
    end

    def render_unreadable_excel
      render json: {message: "File cannot be read. Please ensure that it is a proper excel file. XLSX format is preferred."}, status: :unprocessable_entity
    end

    rescue_from CanCan::AccessDenied do |exception|
      if user_signed_in?
        if current_user.is_active?
          render json: { message: "You don't have permissions.", access: false }, status: :forbidden
        else
          render json: { message: "Your account has been disabled.", access: false }, status: :forbidden
        end
      else
        render json: { message: "You need to be logged in." , access: false }, status: :unauthorized
      end
    end

  end
end
