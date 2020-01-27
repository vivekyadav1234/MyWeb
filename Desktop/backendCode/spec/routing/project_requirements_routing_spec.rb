require "rails_helper"

RSpec.describe ProjectRequirementsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/project_requirements").to route_to("project_requirements#index")
    end

    it "routes to #new" do
      expect(:get => "/project_requirements/new").to route_to("project_requirements#new")
    end

    it "routes to #show" do
      expect(:get => "/project_requirements/1").to route_to("project_requirements#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/project_requirements/1/edit").to route_to("project_requirements#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/project_requirements").to route_to("project_requirements#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/project_requirements/1").to route_to("project_requirements#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/project_requirements/1").to route_to("project_requirements#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/project_requirements/1").to route_to("project_requirements#destroy", :id => "1")
    end

  end
end
