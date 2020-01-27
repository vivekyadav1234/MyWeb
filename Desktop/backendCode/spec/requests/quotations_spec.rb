require 'rails_helper'

RSpec.describe "Quotations", type: :request do
  describe "GET /quotations" do
    it "works! (now write some real specs)" do
      get quotations_path
      expect(response).to have_http_status(200)
    end
  end
end
