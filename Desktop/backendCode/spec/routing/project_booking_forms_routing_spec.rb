require "rails_helper"

RSpec.describe ProjectBookingFormsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/project_booking_forms").to route_to("project_booking_forms#index")
    end

    it "routes to #new" do
      expect(:get => "/project_booking_forms/new").to route_to("project_booking_forms#new")
    end

    it "routes to #show" do
      expect(:get => "/project_booking_forms/1").to route_to("project_booking_forms#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/project_booking_forms/1/edit").to route_to("project_booking_forms#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/project_booking_forms").to route_to("project_booking_forms#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/project_booking_forms/1").to route_to("project_booking_forms#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/project_booking_forms/1").to route_to("project_booking_forms#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/project_booking_forms/1").to route_to("project_booking_forms#destroy", :id => "1")
    end

  end
end
