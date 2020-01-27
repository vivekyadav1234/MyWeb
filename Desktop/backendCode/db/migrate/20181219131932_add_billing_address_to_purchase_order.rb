class AddBillingAddressToPurchaseOrder < ActiveRecord::Migration[5.0]
  def self.up
    add_column :purchase_orders, :billing_address, :string
    add_column :purchase_orders, :billing_contact_person, :string
    add_column :purchase_orders, :billing_contact_number, :string
  end
  def self.down
    remove_column :purchase_orders, :billing_address, :string
    remove_column :purchase_orders, :billing_contact_person, :string
    remove_column :purchase_orders, :billing_contact_number, :string
  end
end
