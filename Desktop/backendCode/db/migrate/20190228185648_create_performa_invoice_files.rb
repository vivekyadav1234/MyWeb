class CreatePerformaInvoiceFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :performa_invoice_files do |t|
      t.references :performa_invoice, index: true
      t.attachment :attachment_file
      t.boolean :tax_invoice, default: false
      t.timestamps
    end
  end
end
