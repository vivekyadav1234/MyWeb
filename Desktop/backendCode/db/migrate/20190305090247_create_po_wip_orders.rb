class CreatePoWipOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :po_wip_orders do |t|
      t.string :po_name
      t.string :status, default: "pending"
      t.text :billing_address
      t.string :billing_contact_person
      t.string :billing_contact_number
      t.text :shipping_address
      t.string :shipping_contact_number
      t.string :shipping_contact_person

      t.timestamps
    end
  end
end
