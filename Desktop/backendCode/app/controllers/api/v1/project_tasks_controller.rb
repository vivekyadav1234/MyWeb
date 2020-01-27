class Api::V1::ProjectTasksController < Api::V1::ApiController
  before_action :set_project
  before_action :set_project_task, only: [:show, :update, :destroy]

  # GET /project_tasks
  def index
    @project_tasks = @project.project_tasks.sort_by(&:actual_start_date)

    render json: @project_tasks
  end

  # GET /project_tasks/1
  def show
    render json: @project_task
  end

  # POST /project_tasks
  def create
    last_task = @project.project_tasks.last
    @project_task = @project.project_tasks.new(project_task_params)
    @project_task.internal_name = last_task.internal_name.to_f + 1.0
    if params[:project_task][:duration].present?
      if params[:project_task][:start_date].present?
        st= params[:project_task][:duration].to_i
        @project_task.end_date = DateTime.parse(params[:project_task][:start_date]) + st.day
      end
    else
      if params[:project_task][:start_date].present? && params[:project_task][:end_date].present?
        s_d_sec = DateTime.parse(params[:project_task][:start_date]).to_i
        e_d_sec = DateTime.parse(params[:project_task][:end_date]).to_i
        duration = (e_d_sec - s_d_sec)/86400
        puts "sunny"
        puts s_d_sec
        puts e_d_sec
        puts duration
        puts "riya"
        @project_task.duration = duration
      end
    end
    @project_task.user = User.find_by_email params[:resource]

    if @project_task.save!
      assign_dependencies
      UserNotifierMailer.scheduler_send_invite(@project_task.user, @project_task).deliver! if @project_task.user.present?
      render json: @project_task, status: :created
    else
      render json: @project_task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /project_tasks/1
  def update
    if @project_task.update(project_task_params)
      @project_task.task_dependencies.delete_all
      # @project_task.task_dependents.delete_all
      assign_dependencies
      UserNotifierMailer.scheduler_send_invite(@project_task.user, @project_task).deliver! if @project_task.user.present?
      render json: @project_task
    else
      render json: @project_task.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_tasks/1
  def destroy
    @project_task.destroy
  end

  # Import tasks from an Excel sheet.Allow only for creating tasks - no editing/deleting.
  def import_tasks
    # filepath = "/Users/arunoday/Downloads/import_tasks.xlsx"
    str = params[:attachment_file].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    filepath = Rails.root.join("tmp").join("tasks.xlsx") 
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index {|header,i|
      headers[header] = i
    }

    imported_task_ids = []
    error_array = []

    ActiveRecord::Base.transaction do
      # Iterate over the rows. Skip the header row in the range.
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        internal_name = workbook.row(row)[headers['TaskID']]
        name = workbook.row(row)[headers['Task Name']]
        next if internal_name.blank? || name.blank?
        email = workbook.row(row)[headers['Resource']].strip
        user = User.find_by_email(email)
        start_date = workbook.row(row)[headers['Start Date']]&.to_date
        end_date = workbook.row(row)[headers['End Date']]&.to_date
        duration = workbook.row(row)[headers['Duration']].to_i
        dependencies = workbook.row(row)[headers['Dependencies']]
        percent_completion = workbook.row(row)[headers['Percent Complete']]*100
        status = workbook.row(row)[headers['Status']]

        # puts "Row: #{internal_name}, #{name}, #{email}, #{start_date}, #{end_date}, #{duration}, #{dependencies}, #{percent_completion}, #{status} \n\n"
        
        if @project.project_tasks.where(internal_name: internal_name).blank?
          # puts user.inspect
          project_task = @project.project_tasks.create!(internal_name: internal_name, name: name, start_date: start_date, 
            end_date: end_date, duration: duration, percent_completion: percent_completion, status: status, user: user)
          # puts "++++++++++++#{project_task.inspect}+++++++++"
          dependencies.split(',').each do |taskid|
            dep = @project.project_tasks.find_by(internal_name: taskid.strip)
            # puts "+++++++++#{taskid}+++++++++"
            # puts dep.inspect
            project_task.upstream_dependencies << dep
          end if dependencies.present?

          if project_task.errors.present?
            error_array << project_task
          else
            imported_task_ids << project_task.id
          end
        end
      end
    end

    if error_array.blank?
      tasks = @project.project_tasks.where(id: imported_task_ids)
      tasks.each do |task|
        UserNotifierMailer.scheduler_send_invite(task.user, task).deliver! if task.user.present?
      end
      render json: tasks, each_serializer: ProjectTaskSerializer
    else
      hash = Hash.new
      error_array.each do |task|
        hash[task.internal_name] = task.errors
      end

      render json: {
        status: 422,
        message: "The following errors occured.",
        error_hash: hash
      }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_task
      key = params[:id].to_i > 0 ? "id" : "internal_name"
      if key == "id"
        @project_task = @project.project_tasks.find(params[:id])
      else
        @project_task = @project.project_tasks.find_by(internal_name: params[:id])
      end
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    def assign_dependencies
      if params[:upstream_dependencies].present?
        params[:upstream_dependencies].split(',').each do |taskid|
          dep = @project.project_tasks.find_by(name: taskid.strip)
          @project_task.upstream_dependencies << dep
        end 
      end
    end  

    # Only allow a trusted parameter "white list" through.
    def project_task_params
      params.require(:project_task).permit(:internal_name, :name, :status, :start_date, :end_date, :duration, 
        :percent_completion, :upstream_dependency_id, :project_id, :task_category_id, :action_point, :process_owner, :remarks)
    end
end
