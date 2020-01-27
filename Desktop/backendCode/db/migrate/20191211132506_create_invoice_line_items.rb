class CreateInvoiceLineItems < ActiveRecord::Migration[5.0]
  def change
    create_table :invoice_line_items do |t|
      t.references :line_item, polymorphic: true, index: true
      t.references :payment_invoice
      t.timestamps
    end
  end
end
