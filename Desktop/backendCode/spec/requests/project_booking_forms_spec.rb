require 'rails_helper'

RSpec.describe "ProjectBookingForms", type: :request do
  describe "GET /project_booking_forms" do
    it "works! (now write some real specs)" do
      get project_booking_forms_path
      expect(response).to have_http_status(200)
    end
  end
end
