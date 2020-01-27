require "rails_helper"

RSpec.describe ProjectHandoversController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/project_handovers").to route_to("project_handovers#index")
    end

    it "routes to #new" do
      expect(:get => "/project_handovers/new").to route_to("project_handovers#new")
    end

    it "routes to #show" do
      expect(:get => "/project_handovers/1").to route_to("project_handovers#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/project_handovers/1/edit").to route_to("project_handovers#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/project_handovers").to route_to("project_handovers#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/project_handovers/1").to route_to("project_handovers#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/project_handovers/1").to route_to("project_handovers#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/project_handovers/1").to route_to("project_handovers#destroy", :id => "1")
    end

  end
end
