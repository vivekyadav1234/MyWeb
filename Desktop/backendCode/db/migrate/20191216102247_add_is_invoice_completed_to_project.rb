class AddIsInvoiceCompletedToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :is_invoice_completed, :boolean, default: :false
  end
end
