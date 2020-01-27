require "rails_helper"

RSpec.describe EdgeBandingShadesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/edge_banding_shades").to route_to("edge_banding_shades#index")
    end

    it "routes to #new" do
      expect(:get => "/edge_banding_shades/new").to route_to("edge_banding_shades#new")
    end

    it "routes to #show" do
      expect(:get => "/edge_banding_shades/1").to route_to("edge_banding_shades#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/edge_banding_shades/1/edit").to route_to("edge_banding_shades#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/edge_banding_shades").to route_to("edge_banding_shades#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/edge_banding_shades/1").to route_to("edge_banding_shades#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/edge_banding_shades/1").to route_to("edge_banding_shades#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/edge_banding_shades/1").to route_to("edge_banding_shades#destroy", :id => "1")
    end

  end
end
