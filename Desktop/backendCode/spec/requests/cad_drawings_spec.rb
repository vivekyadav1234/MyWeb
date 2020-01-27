require 'rails_helper'

RSpec.describe "CadDrawings", type: :request do
  describe "GET /cad_drawings" do
    it "works! (now write some real specs)" do
      get cad_drawings_path
      expect(response).to have_http_status(200)
    end
  end
end
