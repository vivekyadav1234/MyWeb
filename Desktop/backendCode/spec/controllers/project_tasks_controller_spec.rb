require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

RSpec.describe ProjectTasksController, type: :controller do

  # This should return the minimal set of attributes required to create a valid
  # ProjectTask. As you add validations to ProjectTask, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # ProjectTasksController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET #index" do
    it "assigns all project_tasks as @project_tasks" do
      project_task = ProjectTask.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:project_tasks)).to eq([project_task])
    end
  end

  describe "GET #show" do
    it "assigns the requested project_task as @project_task" do
      project_task = ProjectTask.create! valid_attributes
      get :show, params: {id: project_task.to_param}, session: valid_session
      expect(assigns(:project_task)).to eq(project_task)
    end
  end

  describe "GET #new" do
    it "assigns a new project_task as @project_task" do
      get :new, params: {}, session: valid_session
      expect(assigns(:project_task)).to be_a_new(ProjectTask)
    end
  end

  describe "GET #edit" do
    it "assigns the requested project_task as @project_task" do
      project_task = ProjectTask.create! valid_attributes
      get :edit, params: {id: project_task.to_param}, session: valid_session
      expect(assigns(:project_task)).to eq(project_task)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new ProjectTask" do
        expect {
          post :create, params: {project_task: valid_attributes}, session: valid_session
        }.to change(ProjectTask, :count).by(1)
      end

      it "assigns a newly created project_task as @project_task" do
        post :create, params: {project_task: valid_attributes}, session: valid_session
        expect(assigns(:project_task)).to be_a(ProjectTask)
        expect(assigns(:project_task)).to be_persisted
      end

      it "redirects to the created project_task" do
        post :create, params: {project_task: valid_attributes}, session: valid_session
        expect(response).to redirect_to(ProjectTask.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved project_task as @project_task" do
        post :create, params: {project_task: invalid_attributes}, session: valid_session
        expect(assigns(:project_task)).to be_a_new(ProjectTask)
      end

      it "re-renders the 'new' template" do
        post :create, params: {project_task: invalid_attributes}, session: valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested project_task" do
        project_task = ProjectTask.create! valid_attributes
        put :update, params: {id: project_task.to_param, project_task: new_attributes}, session: valid_session
        project_task.reload
        skip("Add assertions for updated state")
      end

      it "assigns the requested project_task as @project_task" do
        project_task = ProjectTask.create! valid_attributes
        put :update, params: {id: project_task.to_param, project_task: valid_attributes}, session: valid_session
        expect(assigns(:project_task)).to eq(project_task)
      end

      it "redirects to the project_task" do
        project_task = ProjectTask.create! valid_attributes
        put :update, params: {id: project_task.to_param, project_task: valid_attributes}, session: valid_session
        expect(response).to redirect_to(project_task)
      end
    end

    context "with invalid params" do
      it "assigns the project_task as @project_task" do
        project_task = ProjectTask.create! valid_attributes
        put :update, params: {id: project_task.to_param, project_task: invalid_attributes}, session: valid_session
        expect(assigns(:project_task)).to eq(project_task)
      end

      it "re-renders the 'edit' template" do
        project_task = ProjectTask.create! valid_attributes
        put :update, params: {id: project_task.to_param, project_task: invalid_attributes}, session: valid_session
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested project_task" do
      project_task = ProjectTask.create! valid_attributes
      expect {
        delete :destroy, params: {id: project_task.to_param}, session: valid_session
      }.to change(ProjectTask, :count).by(-1)
    end

    it "redirects to the project_tasks list" do
      project_task = ProjectTask.create! valid_attributes
      delete :destroy, params: {id: project_task.to_param}, session: valid_session
      expect(response).to redirect_to(project_tasks_url)
    end
  end

end