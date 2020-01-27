class Api::V1::VouchersController < Api::V1::ApiController
  
  skip_before_action :authenticate_user!, only: [:index, :schedule_visit]

  def index
  	@vouchers = Voucher.where(is_used: false).pluck(:code)
    render json: @vouchers
  end

  def schedule_visit
  	if params[:name].present? && params[:contact].present?
      visit_date = params[:visit_date].present? ? DateTime.parse(params[:visit_date]).strftime('%-d %B %Y, %I:%M:%S %p') : "None"
      UserNotifierMailer.schedule_visit_email(params[:name], params[:email], params[:contact], visit_date).deliver_now!
      render json: {message: "Meeting Scheduled Successfully"}, status: 200
    else
      render json: {message: "Missing details"}, status: 200
    end
  end
end