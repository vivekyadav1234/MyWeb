class Api::V1::RecordingsController < Api::V1::ApiController
  before_action :set_event, except: [:create, :index]
  before_action :set_recording, only: [:show, :update, :destroy]
  
  # load_and_authorize_resource

  # GET /api/v1/recordings
  def index
    if params.dig(:event_id)
      @recordings = Recording.where(event_id: params.dig(:event_id))
    elsif params.dig(:lead_id)
      @recordings = Recording.where(
        event_id: Lead.find(params.dig(:lead_id)).project.events.pluck(:id)
      )
    else
      set_event
      @recordings = Recording.where(event_id: @event_ids)
    end
    render json: @recordings
  end

  # GET /api/v1/recordings/1
  def show
    render json: @recording
  end

  # POST /api/v1/recordings
  def create
    if params.dig(:event_id) != 'new'
      set_event
      unless params.dig(:event_id) && @event_ids.include?(params.dig(:event_id).to_i)
        return render json: {
          message: "It seems the event id #{params.dig(:event_id)} does not belongs to you. "
          }, status: :unprocessable_entity
      end
    end
    @recording = Recording.new()
    @recording.user = current_user
    if params.dig(:event_id) != 'new'
      @recording.event_id = params.dig(:event_id)
    else
      @recording.event = Event.create!({agenda: 'follow_up', 
        status: 'done', mom_status: 'present', 
        scheduled_at: Time.zone.now,
        contact_type: 'phone_call', 
        ownerable: Project.find(params[:project_id])
      })
    end
    @recording.duration = params[:duration] if params.dig(:duration)
    @recording.note = params[:note] if params.dig(:note)
    @recording.project_id = params[:project_id] if params.dig(:project_id)
    @recording.call_recording = params[:call_recording]
    if @recording.save
      render json: @recording, status: :created, location: @recording
    else
      render json: {message: @recording.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/recordings/1
  def update
    if @recording.update(recording_params)
      render json: @recording
    else
      render json: {message: @recording.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/recordings/1
  def destroy
    @recording.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recording
      @recording = Recording.where(event_id: @event_ids).find(params[:id])
    end

    def set_event
      if current_user.has_role?(:community_manager)
        events_for_cm = current_user.events
        if params[:actionables_of] == "cm"
          @events = current_user.events
        else
          designers = current_user.designers_for_cm
          event_ids = designers.map{|designer|  designer.events.pluck(:id)}.flatten

          if params[:actionables_of] == "designer"
            @events = Event.where(id: event_ids)
          else
            @events = Event.where(id: (events_for_cm.pluck(:id) + event_ids).uniq)
          end
        end
      elsif current_user.has_role?(:city_gm)
        events_for_gm = current_user.events
        if params[:actionables_of] == "gm"
          @events = current_user.events
        else
          event_ids = []
          GmCmMapping.where(gm_id: current_user.id).each do |cgmap|
            cm = cgmap.cm
            event_ids += cm.events.pluck(:id)
            designers = cm.designers_for_cm
            event_ids += designers.map{|designer|  designer.events.pluck(:id)}.flatten
          end
          if params[:actionables_of] == "designer"
            @events = Event.where(id: event_ids)
          else
            @events = Event.where(id: (events_for_gm.pluck(:id) + event_ids).uniq)
          end
        end

      elsif current_user.has_role?(:designer)
        @events = current_user.events

      elsif current_user.has_role?(:sitesupervisor)
        @events = current_user.events
      end
      @event_ids = @events.pluck(:id)
    end

    # Only allow a trusted parameter "white list" through.
    def recording_params
      params.require(:recording).permit(:call_recording, :event_id,
        :duration,
        :note,
        :project_id
      )
    end
end
