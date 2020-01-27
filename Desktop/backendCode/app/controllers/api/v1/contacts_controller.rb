class Api::V1::ContactsController < Api::V1::ApiController
  before_action :set_contact, only: [:show, :update, :destroy]
  skip_before_action :authenticate_user!

  # GET /contacts
  def index
    @contacts = Contact.all

    render json: @contacts
  end

  # GET /contacts/1
  def show
    render json: @contact
  end

  # POST /contacts
  # @body_parameter [string] phone_number
  # @body_parameter [string] source
  # @response_class ContactSerializer
  def create
    @contact = Contact.new(contact_params)

    begin
      @contact.save!
      render json: @contact, status: :created
    rescue => error
      render json: {message: error.message.sub('Validation failed: ', '')}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contacts/1
  # @body_parameter [string] phone_number
  # @body_parameter [string] source
  # @response_class ContactSerializer
  def update
    if @contact.update(contact_params)
      render json: @contact
    else
      render json: {message: @contact.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /contacts/1
  def destroy
    @contact.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contact
      @contact = Contact.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def contact_params
      params.require(:contact).permit(:phone_number, :source)
    end
end
