class AddTaxColumnsToPerformaInvoices < ActiveRecord::Migration[5.0]
  def change
    add_column :performa_invoices, :base_amount, :float, default: 0.0
    add_column :performa_invoices, :tax_percent, :float, default: 0.0
    change_column :performa_invoices, :amount, 'float USING CAST(amount AS double precision)'
  end
end
