class Api::V1::DesignerBookingFormsController < ApplicationController
  before_action :set_designer_booking_form, only: [:show, :update, :destroy]

  # GET /api/v1/designer_booking_forms/1
  def show
    render json: @designer_booking_form
  end

  # PATCH/PUT /api/v1/designer_booking_forms/1
  def update
    unless @designer_booking_form
      @designer_booking_form = DesignerBookingForm.create(:project_id => @project.id)
    end
    if @designer_booking_form.update(designer_booking_form_params)
      render json: @designer_booking_form
    else
      render json: @designer_booking_form.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/designer_booking_forms/1
  def destroy
    if @designer_booking_form.destroy
      @project.create_designer_booking_form
      render head :no_content
    else
      render json: {message: "The form data could not be deleted. Errors: #{@designer_booking_form.errors.full_messages}"}
    end
  end

private
  # Use callbacks to share common setup or constraints between actions.
  def set_designer_booking_form
    @project = Project.find(params[:id])
    @designer_booking_form = @project.designer_booking_form
  end

  # Only allow a trusted parameter "white list" through.
  def designer_booking_form_params
    params.require(:designer_booking_form).permit(:customer_name, :customer_age, :profession, 
      :family_profession, :age_house, :lifestyle, :house_positive_features, :house_negative_features, 
      :inspiration, :inspiration_image,:color_tones, :theme, :functionality, :false_ceiling, 
      :electrical_points, :special_needs, :vastu_shastra, :all_at_once, :budget_range, 
      :design_style_tastes, :storage_space, :mood, :enhancements, :discuss_in_person, 
      :mk_age, :mk_gut_kitchen, :mk_same_layout, :mk_improvements, :mk_special_requirements, 
      :mk_cooking_details, :mk_appliances, :mk_family_eating_area, :mk_guest_frequence, 
      :mk_storage_patterns, :mk_cabinet_finishing, :mk_countertop_materials, :mk_mood, 
      :project_id)
  end
end
