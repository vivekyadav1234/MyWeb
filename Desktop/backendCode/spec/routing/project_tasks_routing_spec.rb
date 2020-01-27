require "rails_helper"

RSpec.describe ProjectTasksController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/project_tasks").to route_to("project_tasks#index")
    end

    it "routes to #new" do
      expect(:get => "/project_tasks/new").to route_to("project_tasks#new")
    end

    it "routes to #show" do
      expect(:get => "/project_tasks/1").to route_to("project_tasks#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/project_tasks/1/edit").to route_to("project_tasks#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/project_tasks").to route_to("project_tasks#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/project_tasks/1").to route_to("project_tasks#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/project_tasks/1").to route_to("project_tasks#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/project_tasks/1").to route_to("project_tasks#destroy", :id => "1")
    end

  end
end
