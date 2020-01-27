require 'rails_helper'

RSpec.describe "Boqjobs", type: :request do
  describe "GET /boqjobs" do
    it "works! (now write some real specs)" do
      get boqjobs_path
      expect(response).to have_http_status(200)
    end
  end
end
