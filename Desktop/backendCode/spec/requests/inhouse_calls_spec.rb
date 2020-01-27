require 'rails_helper'

RSpec.describe "InhouseCalls", type: :request do
  describe "GET /inhouse_calls" do
    it "works! (now write some real specs)" do
      get inhouse_calls_path
      expect(response).to have_http_status(200)
    end
  end
end
