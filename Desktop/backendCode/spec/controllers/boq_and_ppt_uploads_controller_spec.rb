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

RSpec.describe BoqAndPptUploadsController, type: :controller do

  # This should return the minimal set of attributes required to create a valid
  # BoqAndPptUpload. As you add validations to BoqAndPptUpload, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # BoqAndPptUploadsController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET #index" do
    it "assigns all boq_and_ppt_uploads as @boq_and_ppt_uploads" do
      boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:boq_and_ppt_uploads)).to eq([boq_and_ppt_upload])
    end
  end

  describe "GET #show" do
    it "assigns the requested boq_and_ppt_upload as @boq_and_ppt_upload" do
      boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
      get :show, params: {id: boq_and_ppt_upload.to_param}, session: valid_session
      expect(assigns(:boq_and_ppt_upload)).to eq(boq_and_ppt_upload)
    end
  end

  describe "GET #new" do
    it "assigns a new boq_and_ppt_upload as @boq_and_ppt_upload" do
      get :new, params: {}, session: valid_session
      expect(assigns(:boq_and_ppt_upload)).to be_a_new(BoqAndPptUpload)
    end
  end

  describe "GET #edit" do
    it "assigns the requested boq_and_ppt_upload as @boq_and_ppt_upload" do
      boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
      get :edit, params: {id: boq_and_ppt_upload.to_param}, session: valid_session
      expect(assigns(:boq_and_ppt_upload)).to eq(boq_and_ppt_upload)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new BoqAndPptUpload" do
        expect {
          post :create, params: {boq_and_ppt_upload: valid_attributes}, session: valid_session
        }.to change(BoqAndPptUpload, :count).by(1)
      end

      it "assigns a newly created boq_and_ppt_upload as @boq_and_ppt_upload" do
        post :create, params: {boq_and_ppt_upload: valid_attributes}, session: valid_session
        expect(assigns(:boq_and_ppt_upload)).to be_a(BoqAndPptUpload)
        expect(assigns(:boq_and_ppt_upload)).to be_persisted
      end

      it "redirects to the created boq_and_ppt_upload" do
        post :create, params: {boq_and_ppt_upload: valid_attributes}, session: valid_session
        expect(response).to redirect_to(BoqAndPptUpload.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved boq_and_ppt_upload as @boq_and_ppt_upload" do
        post :create, params: {boq_and_ppt_upload: invalid_attributes}, session: valid_session
        expect(assigns(:boq_and_ppt_upload)).to be_a_new(BoqAndPptUpload)
      end

      it "re-renders the 'new' template" do
        post :create, params: {boq_and_ppt_upload: invalid_attributes}, session: valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested boq_and_ppt_upload" do
        boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
        put :update, params: {id: boq_and_ppt_upload.to_param, boq_and_ppt_upload: new_attributes}, session: valid_session
        boq_and_ppt_upload.reload
        skip("Add assertions for updated state")
      end

      it "assigns the requested boq_and_ppt_upload as @boq_and_ppt_upload" do
        boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
        put :update, params: {id: boq_and_ppt_upload.to_param, boq_and_ppt_upload: valid_attributes}, session: valid_session
        expect(assigns(:boq_and_ppt_upload)).to eq(boq_and_ppt_upload)
      end

      it "redirects to the boq_and_ppt_upload" do
        boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
        put :update, params: {id: boq_and_ppt_upload.to_param, boq_and_ppt_upload: valid_attributes}, session: valid_session
        expect(response).to redirect_to(boq_and_ppt_upload)
      end
    end

    context "with invalid params" do
      it "assigns the boq_and_ppt_upload as @boq_and_ppt_upload" do
        boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
        put :update, params: {id: boq_and_ppt_upload.to_param, boq_and_ppt_upload: invalid_attributes}, session: valid_session
        expect(assigns(:boq_and_ppt_upload)).to eq(boq_and_ppt_upload)
      end

      it "re-renders the 'edit' template" do
        boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
        put :update, params: {id: boq_and_ppt_upload.to_param, boq_and_ppt_upload: invalid_attributes}, session: valid_session
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested boq_and_ppt_upload" do
      boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
      expect {
        delete :destroy, params: {id: boq_and_ppt_upload.to_param}, session: valid_session
      }.to change(BoqAndPptUpload, :count).by(-1)
    end

    it "redirects to the boq_and_ppt_uploads list" do
      boq_and_ppt_upload = BoqAndPptUpload.create! valid_attributes
      delete :destroy, params: {id: boq_and_ppt_upload.to_param}, session: valid_session
      expect(response).to redirect_to(boq_and_ppt_uploads_url)
    end
  end

end