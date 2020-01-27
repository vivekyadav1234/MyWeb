class CreateQuotations < ActiveRecord::Migration[5.0]
  def change
    create_table :quotations do |t|
      t.string :name
      t.text :terms
      t.float :net_amount, default: 0
      t.float :total_amount, default: 0
      t.integer :status, default: 0
      t.references :project, foreign_key: true
      t.references :user, foreign_key: true
      t.text :description
      t.date :generation_date
      t.date :expiration_date
      t.integer :expiration_in_days
      t.jsonb :saved_tax_data
      t.string :billing_address
      t.float :total_amount, default: 0
      t.float :gross_amount, default: 0
      t.text :customer_notes

      t.timestamps
    end
  end
end
