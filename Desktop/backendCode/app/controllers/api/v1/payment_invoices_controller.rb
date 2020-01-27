class Api::V1::PaymentInvoicesController < ApplicationController
  before_action :set_payment_invoice, only: [:show, :update, :destroy]
  load_and_authorize_resource
  
  # GET /payment_invoices
  def index
    @payment_invoices = PaymentInvoice.all

    render json: @payment_invoices
  end

  # GET /payment_invoices/1
  def show
    render json: @payment_invoice
  end
  
  # POST /payment_invoices
  def create
    ActiveRecord::Base.transaction do 
      @payment_invoice = PaymentInvoice.new(payment_invoice_params)      
      if @payment_invoice.save
        if params[:line_items].present?
          params[:line_items].each do |item|
            @payment_invoice.invoice_line_items.create(line_item_type: item[:job_class], line_item_id: item[:job_id], amount: item[:job_amount])  if InvoiceLineItem.find_by(line_item_type: item[:job_class], line_item_id: item[:job_id]).blank?
          end
          amount = @payment_invoice.invoice_line_items.sum(:amount)
          @payment_invoice.update(amount: amount)
        end
        render json: {message: "InvoiceLabel Created Successfully"}, status: :created
      else
        render json: @payment_invoice.errors, status: :unprocessable_entity
      end
    end
  end

  def create_parent_invoice
    if params[:child_invoice_ids].present?
      @payment_invoice = PaymentInvoice.create(payment_invoice_params)
      PaymentInvoice.where(id: params[:child_invoice_ids]).map{|pi| pi.parent_invoice.blank? ? pi.update(parent_invoice_id:  @payment_invoice.id, status: "created") : nil}
      amount = @payment_invoice.child_invoices.sum(:amount)
      @payment_invoice.update(amount: amount , status: "created", is_parent_invoice: true)
      encoded_file = @payment_invoice.generate_invoice_pdf(params[:invoice_info])
      document = "data:application/pdf;base64," + encoded_file
      document_name = "Invoice - " + @payment_invoice.invoice_number&.gsub("/","-").to_s+".pdf"
      @payment_invoice.update(document: document, document_file_name: document_name)
      render json: {message: "Invoice Created Successfully"}, status: :created      
    else
      render json: {message: "invalid params"}, status: 200
    end
  end


  def update_parent_invoice
    if params[:child_invoice_ids].present? && params[:parent_invoice_id].present?
      @payment_invoice = PaymentInvoice.find_by_id params[:parent_invoice_id]
      if @payment_invoice.status == "released"
        return render json: {message: "Invoice is in shared stage"}, status: 200 
      end
      @child_invoices = @payment_invoice.child_invoices
      @child_invoices.update_all(parent_invoice_id: nil, status: "pending")
      PaymentInvoice.where(id: params[:child_invoice_ids]).map{|pi| pi.parent_invoice.blank? ? pi.update(parent_invoice_id:  @payment_invoice.id, status: "created") : nil}
      amount = @payment_invoice.child_invoices.sum(:amount)
      @payment_invoice.update(amount: amount , status: "created", is_parent_invoice: true)
      encoded_file = @payment_invoice.generate_invoice_pdf(params[:invoice_info])
      document = "data:application/pdf;base64," + encoded_file    
      document_name = "Invoice - "+@payment_invoice.invoice_number&.gsub("/","-").to_s+".pdf"
      @payment_invoice.update(document: document, document_file_name: document_name)
      render json: {message: "Invoice updated Successfully"}, status: 200      
    else
      render json: {message: "invalid params"}, status: 200
    end
  end

  def parent_invoices_for_project
    if params[:project_id].present? 
      invoice_info = [] 
      @project = Project.find_by_id params[:project_id]
      if params[:search].present?
        @payment_invoices = @project.payment_invoices.where(is_parent_invoice: true).where("payment_invoices.invoice_number ILIKE ?", "#{params[:search]}%")
      else 
        @payment_invoices = @project.payment_invoices.where(is_parent_invoice: true)
      end        
      @payment_invoices.each do |payment_invoice|
        lead = payment_invoice.project.lead
        invoice_info << {
          id: payment_invoice.id,
          invoice_number: payment_invoice.invoice_number,
          creation_at: payment_invoice.created_at,
          status: payment_invoice.status,
          sharing_date: payment_invoice.sharing_date,
          lead_id: lead.id,
          lead_name: lead.name,
          file_url: payment_invoice.document.url,
          file_name: payment_invoice.document_file_name
        }
      end if @payment_invoices.present?
      render json: {invoice_info: invoice_info}, status: 200
    else
      render json: {message: "invalid params"}, status: 200
    end
  end

  def share_parent_invoice
    if params[:id].present?
      @payment_invoice = PaymentInvoice.find_by_id params[:id]
      @payment_invoice.update status: "released"
      @payment_invoice.child_invoices.map{|ci| ci.update status: "released"}
      @payment_invoice.update_project_invoice_status
      UserNotifierMailer.share_invoice(@payment_invoice).deliver_now 
      render json: {message: "Shared Successfully"}, status: 200   
    else 
      render json: {message: "invalid params"}, status: 200 
    end
  end

  def child_invoices
    if params[:project_id].present?  
      @project = Project.find_by_id params[:project_id]
      @payment_invoices = @project.payment_invoices.where(is_parent_invoice: false)
      render json: @payment_invoices, status: 200
    else
      render json: {message: "invalid params"}, status: 200
    end
  end

  # PATCH/PUT /payment_invoices/1
  def update
    if @payment_invoice.status != "released"  
      if @payment_invoice.update(payment_invoice_params)
        if params[:line_items].present?
          @payment_invoice.invoice_line_items.delete_all
          params[:line_items].each do |item|
            @payment_invoice.invoice_line_items.create(line_item_type: item[:job_class], line_item_id: item[:job_id], amount: item[:job_amount])  if InvoiceLineItem.find_by(line_item_type: item[:job_class], line_item_id: item[:job_id]).blank?
          end
          amount = @payment_invoice.invoice_line_items.sum(:amount)
          @payment_invoice.update amount: amount
          render json: {message: "InvoiceLabel Updated Successfully"}, status: 200
        end
      else
        render json: @payment_invoice.errors, status: :unprocessable_entity
      end
    else
       render json: {message: "You can not edit this, label is shared"}, status: 200
    end 
  end

  # DELETE /payment_invoices/1
  def destroy
    @payment_invoice.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_payment_invoice
      @payment_invoice = PaymentInvoice.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def payment_invoice_params
      params.require(:payment_invoice).permit(:label, :hsn_code, :project_id)
    end
end
