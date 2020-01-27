class RemoveForignKeyFromPurchaseOrder < ActiveRecord::Migration[5.0]
  def change
    remove_foreign_key :purchase_elements, :job_element_vendors
  end
end
