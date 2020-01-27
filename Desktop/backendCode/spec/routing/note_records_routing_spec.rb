require "rails_helper"

RSpec.describe NoteRecordsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/note_records").to route_to("note_records#index")
    end

    it "routes to #new" do
      expect(:get => "/note_records/new").to route_to("note_records#new")
    end

    it "routes to #show" do
      expect(:get => "/note_records/1").to route_to("note_records#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/note_records/1/edit").to route_to("note_records#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/note_records").to route_to("note_records#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/note_records/1").to route_to("note_records#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/note_records/1").to route_to("note_records#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/note_records/1").to route_to("note_records#destroy", :id => "1")
    end

  end
end
