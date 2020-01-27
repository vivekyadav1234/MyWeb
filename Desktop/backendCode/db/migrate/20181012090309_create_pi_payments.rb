class CreatePiPayments < ActiveRecord::Migration[5.0]
  def change
    create_table :pi_payments do |t|
      t.string :description, null: false
      t.string :remarks
      # t.float :amount, null:false, default: 0
      # t.float :tax_amount, null:false, default: 0
      # t.float :total_amount, null:false, default: 0
      t.float :percentage, null: false
      t.string :payment_status, null: false, default: "pending"
      t.datetime :status_updated_at
      t.datetime :payment_due_date

      t.references :performa_invoice, index: true, foreign_key: true
      t.references :created_by, index: true, foreign_key: { to_table: :users}
      t.references :approved_by, index: true, foreign_key: { to_table: :users}

      t.timestamps
    end
  end
end
