require 'rails_helper'

RSpec.describe "EdgeBandingShades", type: :request do
  describe "GET /edge_banding_shades" do
    it "works! (now write some real specs)" do
      get edge_banding_shades_path
      expect(response).to have_http_status(200)
    end
  end
end
