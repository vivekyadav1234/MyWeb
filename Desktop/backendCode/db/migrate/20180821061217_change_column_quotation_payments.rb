class ChangeColumnQuotationPayments < ActiveRecord::Migration[5.0]
  def change
  	add_column :quotation_payments, :purchase_element_ids, :string, array: true, default: []
  end
end
