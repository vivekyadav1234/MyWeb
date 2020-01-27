require "rails_helper"

RSpec.describe CatalogueServicesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/catalogue_services").to route_to("catalogue_services#index")
    end

    it "routes to #new" do
      expect(:get => "/catalogue_services/new").to route_to("catalogue_services#new")
    end

    it "routes to #show" do
      expect(:get => "/catalogue_services/1").to route_to("catalogue_services#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/catalogue_services/1/edit").to route_to("catalogue_services#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/catalogue_services").to route_to("catalogue_services#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/catalogue_services/1").to route_to("catalogue_services#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/catalogue_services/1").to route_to("catalogue_services#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/catalogue_services/1").to route_to("catalogue_services#destroy", :id => "1")
    end

  end
end
