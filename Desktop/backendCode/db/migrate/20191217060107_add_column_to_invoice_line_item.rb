class AddColumnToInvoiceLineItem < ActiveRecord::Migration[5.0]
  def change
    add_column :invoice_line_items, :amount, :float, default: 0.0
  end
end
