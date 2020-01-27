class CreatePayments < ActiveRecord::Migration[5.0]
  def change
    create_table :payments do |t|
      t.references :project, foreign_key: true
      t.references :quotation, foreign_key: true
      t.string :payment_type
      t.float :total_amount
      t.float :amount_to_be_paid
      t.string :mode_of_payment
      t.string :bank
      t.string :branch
      t.date :date_of_checque
      t.float :amount
      t.datetime :date
      t.string :is_approved
      t.timestamps
    end
  end
end
