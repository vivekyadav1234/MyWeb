require 'rails_helper'

RSpec.describe "ScopeOfWorks", type: :request do
  describe "GET /scope_of_works" do
    it "works! (now write some real specs)" do
      get scope_of_works_path
      expect(response).to have_http_status(200)
    end
  end
end
