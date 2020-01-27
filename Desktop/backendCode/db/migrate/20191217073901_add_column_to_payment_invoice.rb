class AddColumnToPaymentInvoice < ActiveRecord::Migration[5.0]
  def change
    add_reference :payment_invoices, :parent_invoice, index: true, foreign_key: {to_table: :payment_invoices}
    add_column :payment_invoices, :amount, :float, default: 0.0
    change_column_default(
        :payment_invoices,
        :status,
        from: nil,
        to: "pending"
    )
  end
end
