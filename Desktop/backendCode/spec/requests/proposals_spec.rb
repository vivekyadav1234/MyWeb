require 'rails_helper'

RSpec.describe "Proposals", type: :request do
  describe "GET /proposals" do
    it "works! (now write some real specs)" do
      get proposals_path
      expect(response).to have_http_status(200)
    end
  end
end
