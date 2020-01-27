class AddAmountToQuotationPayments < ActiveRecord::Migration[5.0]
  def change
    add_column :quotation_payments, :amount, :float
    remove_column :proposal_docs, :user_concern, :boolean
  end
end
