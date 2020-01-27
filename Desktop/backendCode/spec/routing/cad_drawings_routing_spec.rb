require "rails_helper"

RSpec.describe CadDrawingsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/cad_drawings").to route_to("cad_drawings#index")
    end

    it "routes to #new" do
      expect(:get => "/cad_drawings/new").to route_to("cad_drawings#new")
    end

    it "routes to #show" do
      expect(:get => "/cad_drawings/1").to route_to("cad_drawings#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/cad_drawings/1/edit").to route_to("cad_drawings#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/cad_drawings").to route_to("cad_drawings#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/cad_drawings/1").to route_to("cad_drawings#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/cad_drawings/1").to route_to("cad_drawings#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/cad_drawings/1").to route_to("cad_drawings#destroy", :id => "1")
    end

  end
end
