class CreateInvoices < ActiveRecord::Migration[5.0]
  def change
    create_table :invoices do |t|
      t.string :name
      t.text :terms
      t.float :net_amount, default: 0
      t.float :total_amount, default: 0
      t.integer :status, default: 0
      t.references :project, foreign_key: true
      t.references :user, foreign_key: true
      t.text :description
      t.date :invoicing_date
      t.date :due_date
      t.integer :due_in_days, default: 0
      t.integer :payment_status, default: 0
      t.string :billing_address
      t.jsonb :saved_tax_details
      t.float :total_discount, default: 0
      t.float :gross_amount, default: 0
      t.text :customer_notes

      t.timestamps
    end
  end
end
