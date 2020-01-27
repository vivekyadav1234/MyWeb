class CreatePurchaseOrderPerformaInvoices < ActiveRecord::Migration[5.0]
  def change
    create_table :purchase_order_performa_invoices do |t|
      t.references :purchase_order, index: true, foreign_key: true
      t.references :performa_invoice, index: true, foreign_key: true
      t.timestamps
    end
  end
end
