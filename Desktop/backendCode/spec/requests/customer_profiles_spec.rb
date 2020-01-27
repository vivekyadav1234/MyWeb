require 'rails_helper'

RSpec.describe "CustomerProfiles", type: :request do
  describe "GET /customer_profiles" do
    it "works! (now write some real specs)" do
      get customer_profiles_path
      expect(response).to have_http_status(200)
    end
  end
end
