class CreatePerformaInvoices < ActiveRecord::Migration[5.0]
  def change
    create_table :performa_invoices do |t|
      t.references :quotation, index: true, foreign_key: true
      t.references :vendor, index: true, foreign_key: true
      t.string :amount
      t.string :description
      t.string :reference_no
      t.timestamps
    end
  end
end
