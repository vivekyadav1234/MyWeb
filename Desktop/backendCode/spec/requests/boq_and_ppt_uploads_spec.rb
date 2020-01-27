require 'rails_helper'

RSpec.describe "BoqAndPptUploads", type: :request do
  describe "GET /boq_and_ppt_uploads" do
    it "works! (now write some real specs)" do
      get boq_and_ppt_uploads_path
      expect(response).to have_http_status(200)
    end
  end
end
