class Api::V1::NoteRecordsController < Api::V1::ApiController
  before_action :set_note_record, only: [:show, :update, :destroy]
  before_action :set_ownerable, except: [:get_billing_address, :get_city_details, :get_society_details]

  # GET /note_records
  def index
    @note_records = @ownerable.note_records.reverse
    if @note_records.present?
      render json: @note_records
    else
      render json: {note_records: @note_records}
    end
  end

  # GET /note_records/1
  def show
    render json: @note_record
  end

  # POST /note_records
  def create
    lead_questionaire_items = params[:lead_questionaire_items_attributes]
    @note_record = @ownerable.note_records.first_or_initialize
    @note_record.assign_attributes(note_record_params)
    
    # if s3 url is present
    # then convert //s3.amazon.com to https://s3.amazon.com
    if params[:lead_floorplan]
      if params[:lead_floorplan].include?("s3.amazonaws.com")
        # added url decoder to avoid url endodings
        @note_record.lead_floorplan = URI.decode("https:"+params[:lead_floorplan])
      else
        @note_record.lead_floorplan = params[:lead_floorplan]
      end
    end
    @note_record.ownerable = @ownerable
    @ownerable.update!(pincode: params[:pincode]) if params[:pincode].present?
    if @note_record.save
      if params[:site_layouts].present?
        params[:site_layouts].each do |layout|
          @note_record.site_layouts.create!(layout_image_file_name: layout[:file_name], layout_image: layout[:image])
        end
      end
      # adding updated lead_questionaire_items
      if lead_questionaire_items && lead_questionaire_items.count > 0
          @note_record.lead_questionaire_items.destroy_all
        lead_questionaire_items.each do |item|
          @note_record.lead_questionaire_items.create(name: item["name"], quantity: item["quantity"], price: item["price"])
        end
      end
      AlternateContact.add_alternate_contact(params[:alternate_contacts], @note_record.ownerable.id, "Lead") if params[:alternate_contacts].present?
      @ownerable.assign_to_cm if @ownerable.lead_status == "qualified" && @ownerable.lead_type&.name == "customer"
      # For delayed possession, set up a proper follow up event.
      if @ownerable.lead_status == "delayed_possession" || @ownerable.lead_status == "delayed_project"
        intended_time = @ownerable.reload.intended_time(@ownerable.lead_status)
        if @ownerable.persisted? && intended_time.present?
          @ownerable.schedule_delay(intended_time)
        end
      end

      # if @ownerable.class.name == "Lead" && @ownerable.lead_status == "qualified" &&  @ownerable.lead_type&.name == "customer"
      #   @ownerable.send_mail_to_cm_for_qualified_leads
      # end
      render json: @note_record, status: :created
    else
      render json: @note_record.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /note_records/1
  def update
    lead_questionaire_items = params[:lead_questionaire_items_attributes]
    @note_record.assign_attributes(note_record_params)
    @note_record.lead_floorplan = params[:lead_floorplan] if params[:lead_floorplan]
    @note_record.ownerable = @ownerable
    @ownerable.update!(pincode: params[:pincode]) if params[:pincode].present?
    if @note_record.save
      if params[:site_layouts].present?
        params[:site_layouts].each do |layout|
          @note_record.site_layouts.create!(layout_image_file_name: layout[:file_name], layout_image: layout[:image])
        end
      end
      # adding updated lead_questionaire_items
      if lead_questionaire_items && lead_questionaire_items.count > 0
          @note_record.lead_questionaire_items.destroy_all
        lead_questionaire_items.each do |item|
          @note_record.lead_questionaire_items.create!(name: item["name"], quantity: item["quantity"], price: item["price"])
        end
      end

      AlternateContact.add_alternate_contact(params[:alternate_contacts], @note_record.ownerable.id, "Lead") if params[:alternate_contacts].present?
      @ownerable.assign_to_cm  if @ownerable.lead_status == "qualified" && @ownerable.lead_type&.name == "customer"
      render json: @note_record
    else
      render json: @note_record.errors, status: :unprocessable_entity
    end
  end

  # DELETE /note_records/1
  def destroy
    @note_record.destroy
  end

  def get_billing_address
    project = Project.find_by(id: params[:project_id])
      if (params[:look_address] == 'Same as Shipping address' || params[:look_address] == 'Same as Communication address')
        billing_address = project.lead&.note_records&.last&.location
        render json: {billing_address: billing_address}
      else
      render json: {message: "invalid params"}, status: 400
      end
  end
  
  def get_city_details
    if params[:city_name].present? && params[:search].present?
      @city_details = BuildingCrawler.where(city: params[:city_name].humanize).where("building_crawlers.building_name ILIKE ?", "#{params[:search]}%").first(11)
      if @city_details.present?
        render json: @city_details, status: 200
      else  
        render json: {building_crawlers: []}, status: 200
      end
    elsif params[:city_name].present?
      @city_details = BuildingCrawler.where(city: params[:city_name].humanize).first(11)
      if @city_details.present?
        render json: @city_details, status: 200
      else  
        render json: {building_crawlers: []}, status: 200
      end
    else
      render json: {message: "invalid params"}, status: 400
    end
  end

  def get_society_details
    data_hash = {}
    society_detail = BuildingCrawler.find_by(id: params[:id])
    type_data = []
    society_detail.building_crawler_details.each do |detail|
      bhk_types = detail.bhk_type.split(",")
      bhk_types.each do |bt|
        type_array = bt.split("-")
        type_data << {
          "type": type_array[0],
          "area": type_array[1],
          "price": type_array[2]
        }
      end if bhk_types.present?
    end if society_detail&.building_crawler_details&.present?
    floorplan_data = []
    society_detail.building_crawler_floorplans.each do |floorplan|
      floorplan_data.push(floorplan.url)
    end if society_detail&.building_crawler_floorplans&.present?
    possession =  society_detail.building_crawler_details.last.possession if society_detail&.present?
    data_hash['bhk'] = type_data.uniq
    data_hash['floorplan'] = floorplan_data.uniq 
    data_hash['possession'] = possession
    data_hash['locality'] =  society_detail&.locality
    data_hash['society'] = society_detail&.building_name
    render json: data_hash, status: 200
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_note_record
      @note_record = NoteRecord.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def note_record_params
      params.require(:note_record).permit(:notes, :ownerable_type, :ownerable_id, :user_id, :customer_name, :phone,
        :project_name, :city, :location, :project_type, :accomodation_type, :possession_status, :have_homeloan,
        :call_back_day, :call_back_time, :have_floorplan, :lead_generator, :additional_comments, :remarks_of_sow,
        :possession_status_date, :home_value, :budget_value, :lead_floorplan, :society, :lead_source, :home_type,:cm_comments,
        :type_of_space,:area_of_site, :status_of_property, :project_commencement_date, :address_of_site, :layout_and_photographs_of_site,
        :designer_comments, :intended_date, :financial_solution_required, :building_crawler_id,
        :site_measurement_required, :site_measurement_date, :visit_ec, :new_society_value,
        :visit_ec_date,:new_city_value, :purpose_of_property, :new_locality_value, :good_time_to_call, scope_of_work: [],
        lead_questionaire_items_attributes: [:id, :name, :quantity, :price, :total, :_destroy])
    end

    def set_ownerable
      @ownerable = params[:ownerable_type].constantize.find(params[:ownerable_id])
    end

    def create_event_for_follow_up(follow_up_time, status, user_type, lead_id, emails)
      @event = Event.new(agenda: status, scheduled_at: follow_up_time, ownerable: Lead.find(lead_id), contact_type: "phone_call")
      @event.save
      @event.add_participants(emails, current_user.id)
      @event.save!
    end
end
