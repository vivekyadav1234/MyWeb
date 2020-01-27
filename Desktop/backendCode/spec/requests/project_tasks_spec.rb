require 'rails_helper'

RSpec.describe "ProjectTasks", type: :request do
  describe "GET /project_tasks" do
    it "works! (now write some real specs)" do
      get project_tasks_path
      expect(response).to have_http_status(200)
    end
  end
end
