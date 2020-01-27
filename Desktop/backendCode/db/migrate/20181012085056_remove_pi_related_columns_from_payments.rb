class RemovePiRelatedColumnsFromPayments < ActiveRecord::Migration[5.0]
  def change
    remove_column :payments, :total_amount
    remove_column :quotation_payments, :purchase_element_ids
  end
end
