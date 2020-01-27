class AddCustomerViewingToQuotation < ActiveRecord::Migration
  def change
  	add_column :quotations, :customer_viewing_option, :text, array: true, default: ["boq"]
  end
end
