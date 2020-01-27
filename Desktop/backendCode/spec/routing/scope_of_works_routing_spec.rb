require "rails_helper"

RSpec.describe ScopeOfWorksController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/scope_of_works").to route_to("scope_of_works#index")
    end

    it "routes to #new" do
      expect(:get => "/scope_of_works/new").to route_to("scope_of_works#new")
    end

    it "routes to #show" do
      expect(:get => "/scope_of_works/1").to route_to("scope_of_works#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/scope_of_works/1/edit").to route_to("scope_of_works#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/scope_of_works").to route_to("scope_of_works#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/scope_of_works/1").to route_to("scope_of_works#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/scope_of_works/1").to route_to("scope_of_works#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/scope_of_works/1").to route_to("scope_of_works#destroy", :id => "1")
    end

  end
end
