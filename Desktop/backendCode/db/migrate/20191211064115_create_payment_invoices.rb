class CreatePaymentInvoices < ActiveRecord::Migration[5.0]
  def change
    create_table :payment_invoices do |t|
      t.string :invoice_number
      t.string :status
      t.datetime :sharing_date
      t.string :label
      t.string :hsn_code
      t.references :project, index: true
      t.timestamps 
    end
  end
end
