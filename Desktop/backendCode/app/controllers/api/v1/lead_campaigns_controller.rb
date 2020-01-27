class Api::V1::LeadCampaignsController < Api::V1::ApiController
  before_action :set_lead_campaign, only: [:show, :update, :destroy]
  load_and_authorize_resource

  # GET /lead_campaigns
  def index
    @lead_campaigns = LeadCampaign.all

    render json: @lead_campaigns
  end

  # GET /lead_campaigns/1
  def show
    render json: @lead_campaign
  end

  # POST /lead_campaigns
  def create
    @lead_campaign = LeadCampaign.new(lead_campaign_params)

    if @lead_campaign.save
      render json: @lead_campaign, status: :created
    else
      render json: @lead_campaign.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lead_campaigns/1
  def update
    if @lead_campaign.update(lead_campaign_params)
      render json: @lead_campaign
    else
      render json: @lead_campaign.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lead_campaigns/1
  def destroy
    if @lead_campaign.destroy
      render json: {message: 'Campaign successfully deleted.'}
    else
      render json: @lead_campaigns.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lead_campaign
      @lead_campaign = LeadCampaign.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def lead_campaign_params
      params.require(:lead_campaign).permit(:name, :start_date, :end_date, :status, :location)
    end
end
