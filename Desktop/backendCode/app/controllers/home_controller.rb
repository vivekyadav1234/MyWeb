class HomeController < ApplicationController
  def show
    render json: {:message => "Welcome to Arrivae API."}
  end
end
