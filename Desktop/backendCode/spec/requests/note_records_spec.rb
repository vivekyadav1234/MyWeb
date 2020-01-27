require 'rails_helper'

RSpec.describe "NoteRecords", type: :request do
  describe "GET /note_records" do
    it "works! (now write some real specs)" do
      get note_records_path
      expect(response).to have_http_status(200)
    end
  end
end
