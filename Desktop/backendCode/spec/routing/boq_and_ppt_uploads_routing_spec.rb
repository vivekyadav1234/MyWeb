require "rails_helper"

RSpec.describe BoqAndPptUploadsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/boq_and_ppt_uploads").to route_to("boq_and_ppt_uploads#index")
    end

    it "routes to #new" do
      expect(:get => "/boq_and_ppt_uploads/new").to route_to("boq_and_ppt_uploads#new")
    end

    it "routes to #show" do
      expect(:get => "/boq_and_ppt_uploads/1").to route_to("boq_and_ppt_uploads#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/boq_and_ppt_uploads/1/edit").to route_to("boq_and_ppt_uploads#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/boq_and_ppt_uploads").to route_to("boq_and_ppt_uploads#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/boq_and_ppt_uploads/1").to route_to("boq_and_ppt_uploads#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/boq_and_ppt_uploads/1").to route_to("boq_and_ppt_uploads#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/boq_and_ppt_uploads/1").to route_to("boq_and_ppt_uploads#destroy", :id => "1")
    end

  end
end
