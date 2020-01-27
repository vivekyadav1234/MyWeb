class AddColumnToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :designs, :design_type, :string
    add_column :quotations, :quotation_type, :string
  end
end
