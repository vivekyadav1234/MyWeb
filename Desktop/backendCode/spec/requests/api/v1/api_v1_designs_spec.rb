require 'rails_helper'

RSpec.describe "Api::V1::Designs", type: :request do
  describe "GET /api_v1_designs" do
    it "works! (now write some real specs)" do
      get api_v1_designs_path
      expect(response).to have_http_status(200)
    end
  end
end
