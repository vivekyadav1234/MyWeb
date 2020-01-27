require 'rails_helper'

RSpec.describe "ProjectDetails", type: :request do
  describe "GET /project_details" do
    it "works! (now write some real specs)" do
      get project_details_path
      expect(response).to have_http_status(200)
    end
  end
end
