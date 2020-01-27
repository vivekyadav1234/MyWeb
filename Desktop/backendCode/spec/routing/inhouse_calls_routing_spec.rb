require "rails_helper"

RSpec.describe InhouseCallsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/inhouse_calls").to route_to("inhouse_calls#index")
    end

    it "routes to #new" do
      expect(:get => "/inhouse_calls/new").to route_to("inhouse_calls#new")
    end

    it "routes to #show" do
      expect(:get => "/inhouse_calls/1").to route_to("inhouse_calls#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/inhouse_calls/1/edit").to route_to("inhouse_calls#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/inhouse_calls").to route_to("inhouse_calls#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/inhouse_calls/1").to route_to("inhouse_calls#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/inhouse_calls/1").to route_to("inhouse_calls#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/inhouse_calls/1").to route_to("inhouse_calls#destroy", :id => "1")
    end

  end
end
