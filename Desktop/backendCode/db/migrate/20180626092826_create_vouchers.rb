class CreateVouchers < ActiveRecord::Migration[5.0]
  def change
    create_table :vouchers do |t|
      t.references :lead, foreign_key: true
      t.string :code
      t.boolean :is_used, default: false, null: false
      t.timestamps
    end
  end
end
