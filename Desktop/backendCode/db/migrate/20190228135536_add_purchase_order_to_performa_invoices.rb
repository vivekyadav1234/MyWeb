class AddPurchaseOrderToPerformaInvoices < ActiveRecord::Migration[5.0]
  def change
    add_reference :performa_invoices, :purchase_order, foreign_key: true
  end
end
