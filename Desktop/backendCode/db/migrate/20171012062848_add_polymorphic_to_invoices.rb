class AddPolymorphicToInvoices < ActiveRecord::Migration[5.0]
  def change
    add_column :invoices, :invoicable_id, :integer
    add_column :invoices, :invoicable_type, :string
    add_column :invoices, :rolable_type, :string
    add_column :invoices, :rolable_id, :integer
  end
end
