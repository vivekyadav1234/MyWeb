require 'rails_helper'

RSpec.describe "CatalogueServices", type: :request do
  describe "GET /catalogue_services" do
    it "works! (now write some real specs)" do
      get catalogue_services_path
      expect(response).to have_http_status(200)
    end
  end
end
