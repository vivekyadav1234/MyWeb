class AddIsInvoiceColumnToPaymentInvoice < ActiveRecord::Migration[5.0]
  def change
    add_column :payment_invoices, :is_parent_invoice, :boolean, default: :false
    change_column_default(
      :payment_invoices,
      :status,
      from: nil,
      to: "pending"
    )
  end
end
