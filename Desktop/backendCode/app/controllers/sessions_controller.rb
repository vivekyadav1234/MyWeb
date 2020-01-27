class SessionsController < DeviseTokenAuth::SessionsController

  # Overwriting destroy action to set user to offline - this is for csagent but will happen
  # for all users
  def destroy
    @resource.update!(online_status: false) if @resource
    super
  end

  def resource_data(opts = {})
    opts[:resource_json] || @resource.as_json
  end

  def render_new_error
    render json: {
      message: [I18n.t("devise_token_auth.sessions.not_supported")]
    }, status: 405
  end

  def render_create_success
    super
  end

  def render_create_error_not_confirmed
    render json: {
      message: [I18n.t("devise_token_auth.sessions.not_confirmed", email: @resource.email)]
    }, status: 404
  end

  def render_create_error_bad_credentials
    render json: {
      message: [I18n.t("devise_token_auth.sessions.bad_credentials")]
    }, status: 402
  end

  def render_destroy_success
    render json: {
    }, status: 200
  end

  def render_destroy_error
    render json: {
      message: [I18n.t("devise_token_auth.sessions.user_not_found")]
    }, status: 404
  end

end
