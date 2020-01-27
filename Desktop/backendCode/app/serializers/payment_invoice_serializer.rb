class PaymentInvoiceSerializer < ActiveModel::Serializer
  attributes :id, :invoice_number, :status, :sharing_date, :amount ,:label, :hsn_code, :project_id, :created_at, :updated_at

  attribute :invoice_line_items
  attribute :amount_with_tax
  attribute :quaunity
  attribute :tax
  attribute :parent_invoice_id


  def invoice_line_items
    object.invoice_line_items.map{|invoice_line_item| {job_type: invoice_line_item.line_item_type, job_id: invoice_line_item.line_item_id}}  if object.invoice_line_items.present?
  end

  def amount_with_tax
    object.amount.to_f * (1.18)
  end

  def quaunity
    1.0
  end

  def tax
    18.0
  end


end
