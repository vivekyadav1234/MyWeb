class CreateQuotationPayments < ActiveRecord::Migration[5.0]
  def change
    create_table :quotation_payments do |t|
      t.references :quotation, index: true, foreign_key: true
      t.references :payment, index: true, foreign_key: true
      t.timestamps
    end
  end
end
