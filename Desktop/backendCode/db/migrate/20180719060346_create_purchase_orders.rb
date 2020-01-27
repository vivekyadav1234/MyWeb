class CreatePurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :purchase_orders do |t|
      t.references :project, index: true, foreign_key: true
      t.references :quotation, index: true, foreign_key: true
      t.references :job_element_vendor, index: true, foreign_key: true
      t.string :status, default: "pending"
      t.string :contact_person
      t.string :contact_number
      t.string :shipping_address
      t.string :consignor_name
      t.string :consignor_address
      t.string :reference_no

      t.timestamps
    end
  end
end
