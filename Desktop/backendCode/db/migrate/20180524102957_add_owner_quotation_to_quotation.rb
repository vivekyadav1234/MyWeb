class AddOwnerQuotationToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_reference :quotations, :parent_quotation, index: true
    add_column :quotations, :copied, :boolean
  end
end
