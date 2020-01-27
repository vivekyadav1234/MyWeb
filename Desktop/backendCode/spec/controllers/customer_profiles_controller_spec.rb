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

RSpec.describe CustomerProfilesController, type: :controller do

  # This should return the minimal set of attributes required to create a valid
  # CustomerProfile. As you add validations to CustomerProfile, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # CustomerProfilesController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET #index" do
    it "assigns all customer_profiles as @customer_profiles" do
      customer_profile = CustomerProfile.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:customer_profiles)).to eq([customer_profile])
    end
  end

  describe "GET #show" do
    it "assigns the requested customer_profile as @customer_profile" do
      customer_profile = CustomerProfile.create! valid_attributes
      get :show, params: {id: customer_profile.to_param}, session: valid_session
      expect(assigns(:customer_profile)).to eq(customer_profile)
    end
  end

  describe "GET #new" do
    it "assigns a new customer_profile as @customer_profile" do
      get :new, params: {}, session: valid_session
      expect(assigns(:customer_profile)).to be_a_new(CustomerProfile)
    end
  end

  describe "GET #edit" do
    it "assigns the requested customer_profile as @customer_profile" do
      customer_profile = CustomerProfile.create! valid_attributes
      get :edit, params: {id: customer_profile.to_param}, session: valid_session
      expect(assigns(:customer_profile)).to eq(customer_profile)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new CustomerProfile" do
        expect {
          post :create, params: {customer_profile: valid_attributes}, session: valid_session
        }.to change(CustomerProfile, :count).by(1)
      end

      it "assigns a newly created customer_profile as @customer_profile" do
        post :create, params: {customer_profile: valid_attributes}, session: valid_session
        expect(assigns(:customer_profile)).to be_a(CustomerProfile)
        expect(assigns(:customer_profile)).to be_persisted
      end

      it "redirects to the created customer_profile" do
        post :create, params: {customer_profile: valid_attributes}, session: valid_session
        expect(response).to redirect_to(CustomerProfile.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved customer_profile as @customer_profile" do
        post :create, params: {customer_profile: invalid_attributes}, session: valid_session
        expect(assigns(:customer_profile)).to be_a_new(CustomerProfile)
      end

      it "re-renders the 'new' template" do
        post :create, params: {customer_profile: invalid_attributes}, session: valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested customer_profile" do
        customer_profile = CustomerProfile.create! valid_attributes
        put :update, params: {id: customer_profile.to_param, customer_profile: new_attributes}, session: valid_session
        customer_profile.reload
        skip("Add assertions for updated state")
      end

      it "assigns the requested customer_profile as @customer_profile" do
        customer_profile = CustomerProfile.create! valid_attributes
        put :update, params: {id: customer_profile.to_param, customer_profile: valid_attributes}, session: valid_session
        expect(assigns(:customer_profile)).to eq(customer_profile)
      end

      it "redirects to the customer_profile" do
        customer_profile = CustomerProfile.create! valid_attributes
        put :update, params: {id: customer_profile.to_param, customer_profile: valid_attributes}, session: valid_session
        expect(response).to redirect_to(customer_profile)
      end
    end

    context "with invalid params" do
      it "assigns the customer_profile as @customer_profile" do
        customer_profile = CustomerProfile.create! valid_attributes
        put :update, params: {id: customer_profile.to_param, customer_profile: invalid_attributes}, session: valid_session
        expect(assigns(:customer_profile)).to eq(customer_profile)
      end

      it "re-renders the 'edit' template" do
        customer_profile = CustomerProfile.create! valid_attributes
        put :update, params: {id: customer_profile.to_param, customer_profile: invalid_attributes}, session: valid_session
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested customer_profile" do
      customer_profile = CustomerProfile.create! valid_attributes
      expect {
        delete :destroy, params: {id: customer_profile.to_param}, session: valid_session
      }.to change(CustomerProfile, :count).by(-1)
    end

    it "redirects to the customer_profiles list" do
      customer_profile = CustomerProfile.create! valid_attributes
      delete :destroy, params: {id: customer_profile.to_param}, session: valid_session
      expect(response).to redirect_to(customer_profiles_url)
    end
  end

end
