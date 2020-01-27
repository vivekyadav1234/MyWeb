class AddDesignerToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_reference :quotations, :designer, index: true, foreign_key: {to_table: :users}
    add_reference :invoices, :designer, index: true, foreign_key: {to_table: :users}    
  end
end
