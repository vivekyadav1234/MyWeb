require 'rails_helper'

RSpec.describe "Api::V1::MediaPages", type: :request do
  describe "GET /api_v1_media_pages" do
    it "works! (now write some real specs)" do
      get api_v1_media_pages_path
      expect(response).to have_http_status(200)
    end
  end
end
