require "rails_helper"

RSpec.describe QuotationsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/quotations").to route_to("quotations#index")
    end

    it "routes to #new" do
      expect(:get => "/quotations/new").to route_to("quotations#new")
    end

    it "routes to #show" do
      expect(:get => "/quotations/1").to route_to("quotations#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/quotations/1/edit").to route_to("quotations#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/quotations").to route_to("quotations#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/quotations/1").to route_to("quotations#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/quotations/1").to route_to("quotations#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/quotations/1").to route_to("quotations#destroy", :id => "1")
    end

  end
end
