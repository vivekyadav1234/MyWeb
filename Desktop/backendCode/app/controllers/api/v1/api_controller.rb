module Api::V1
  class ApiController < ApplicationController
    before_action :authenticate_user!
    before_action :set_last_request_at 
    before_action :set_paper_trail_whodunnit

    respond_to :json
    #rolify
    include CanCan::ControllerAdditions

    private
    def set_last_request_at
      current_user.update_attribute(:last_request_at, Time.zone.now) if user_signed_in?
    end 
  end
end
