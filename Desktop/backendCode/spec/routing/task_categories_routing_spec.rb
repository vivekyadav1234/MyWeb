require "rails_helper"

RSpec.describe TaskCategoriesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/task_categories").to route_to("task_categories#index")
    end

    it "routes to #new" do
      expect(:get => "/task_categories/new").to route_to("task_categories#new")
    end

    it "routes to #show" do
      expect(:get => "/task_categories/1").to route_to("task_categories#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/task_categories/1/edit").to route_to("task_categories#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/task_categories").to route_to("task_categories#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/task_categories/1").to route_to("task_categories#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/task_categories/1").to route_to("task_categories#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/task_categories/1").to route_to("task_categories#destroy", :id => "1")
    end

  end
end
