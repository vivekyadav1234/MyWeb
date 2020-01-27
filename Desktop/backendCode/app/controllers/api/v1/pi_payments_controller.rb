require "#{Rails.root.join('app','serializers','fja_pi_payments_serializer')}"
class Api::V1::PiPaymentsController < Api::V1::ApiController
  before_action :set_pi_payment, only: [:payment_approval, :destroy]
  load_and_authorize_resource except: [:payment_approval, :destroy]

  def index
    @performa_invoice = PerformaInvoice.find params[:performa_invoice_id]
    render json: @performa_invoice.pi_payments, status: 200
  end

  def create
    ActiveRecord::Base.transaction do
      @pi_payment = PiPayment.new(pi_payment_params)
      @pi_payment.created_by = current_user
      @pi_payment.attachment = params[:pi_payment][:attachment] if params[:pi_payment][:attachment].present?

      if @pi_payment.save
        TaskEscalation.mark_done_task("Payment Request", "50 %", @pi_payment.performa_invoice.quotation)
        UserNotifierMailer.pi_payment_added(@pi_payment).deliver_now!
        render json: @pi_payment
      else
        render json: {message: @pi_payment.errors.full_messages}, status: 422
      end
    end

    rescue ActiveRecord::RecordInvalid
      render json: {message: "Something went wrong.}"}, status: 200
  end
  
  # Here you can approve or reject the payment request made by catagory.
  # To make payment transaction_number is must
  # catagory and vendor will be notified acording to the payment status 
  def payment_approval
    if params[:payment_status] == "approved"
      if !params[:transaction_number].present?
        return render json: {message: "Please Send Transaction Number"}  
      end
    end

    @pi_payment.assign_attributes(payment_status: params[:payment_status], remarks: params[:remarks], approved_by: current_user, 
      status_updated_at: Time.zone.now, transaction_number: params[:transaction_number])
    if @pi_payment.save
      if params[:payment_status] == "approved"
        TaskEscalation.mark_done_task("Payment Release", "50 %", @pi_payment.performa_invoice.quotation)
        UserNotifierMailer.pi_payment_approved_to_vendor(@pi_payment).deliver_now!
      end
      UserNotifierMailer.pi_payment_approved(@pi_payment).deliver_now!
      render json: {message: "Status Updated"}, status: 200
    else
      render json: @pi_payment.errors.full_messages, status: 422
    end
  end

  def show
    render json: @pi_payment
  end

  # here you vill get pi payment history
  # if params[:finance_status] is pending then you will get pending payment requests else you will get completed payment request
  # filters are included in this method itself 
  def vendor_payment_history
    page_size = 15
    @competed_payments = PiPayment.action_taken.includes(:performa_invoice)
    @pending_payments = PiPayment.pending.includes(:performa_invoice)
    @payments = params[:finance_status] == "pending" ? @pending_payments.order(created_at: :desc) : @competed_payments.order(updated_at: :desc)
    vendor_ids = @payments.pluck(:vendor_id)
    vendors = Vendor.where(id: vendor_ids).map{|v| {id: v.id, name: v.name}}
    # filters
    @payments =  @payments.filter_by_vendor(params[:vendor_id]) if params[:vendor_id].present?
    @payments =  @payments.filter_by_ageing(params[:ageing].to_i) if params[:ageing].present?
    if params[:from_date].present? || params[:to_date].present?
      from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
      @payments =  @payments.filter_by_date({from_time: from_time,to_time: to_time}) 
    end
    page = params[:page].to_i
    if @payments.count < ((page - 1) * 15)
      params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
    end
    render json: {competed_payments: @competed_payments.count, pending_payments: @pending_payments.count,pi_payments: FjaPiPaymentsSerializer.new(paginate @payments, per_page: page_size).serializable_hash, vendors: vendors}
  end
  
  #  This method is for client ledger
  def vendor_payment_ledger
    @payments = PiPayment.action_taken.includes(:performa_invoice)
    vendor_ids = @payments.pluck(:vendor_id)
    vendors = Vendor.where(id: vendor_ids).map{|v| {id: v.id, name: v.name}}
    # filters
    @payments =  @payments.filter_by_vendor(params[:vendor_id]) if params[:vendor_id].present?
    @payments =  @payments.filter_by_ageing(params[:ageing].to_i) if params[:ageing].present?
    if params[:from_date].present? || params[:to_date].present?
      from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now-10.years
      to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
      @payments =  @payments.filter_by_date({from_time: from_time,to_time: to_time}) 
    end
    render json: {pi_payments: PiPaymentLedgerSerializer.new(@payments).serializable_hash, vendors: vendors}
  end

  def destroy
    if @pi_payment.payment_status == "pending"
      if @pi_payment.destroy
        render json: {message: 'Payment Request successfully deleted.'}
      else
        render json: {message: 'Cannot destroy.'}, status: :unprocessable_entity
      end
    else
      render json: {message: 'Cannot destroy.'}, status: :unprocessable_entity
    end
  end

  private
  def set_pi_payment
    @pi_payment = PiPayment.find params[:id]
  end

  def pi_payment_params
    params.require(:pi_payment).permit(:description, :remarks, :percentage, :payment_due_date, :performa_invoice_id, :created_at, :updated_at)
  end

end
