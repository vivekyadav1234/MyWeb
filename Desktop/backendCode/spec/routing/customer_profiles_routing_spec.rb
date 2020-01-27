require "rails_helper"

RSpec.describe CustomerProfilesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/customer_profiles").to route_to("customer_profiles#index")
    end

    it "routes to #new" do
      expect(:get => "/customer_profiles/new").to route_to("customer_profiles#new")
    end

    it "routes to #show" do
      expect(:get => "/customer_profiles/1").to route_to("customer_profiles#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/customer_profiles/1/edit").to route_to("customer_profiles#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/customer_profiles").to route_to("customer_profiles#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/customer_profiles/1").to route_to("customer_profiles#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/customer_profiles/1").to route_to("customer_profiles#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/customer_profiles/1").to route_to("customer_profiles#destroy", :id => "1")
    end

  end
end
