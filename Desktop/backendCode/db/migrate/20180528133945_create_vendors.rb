class CreateVendors < ActiveRecord::Migration[5.0]
  def change
    create_table :vendors do |t|
      t.string :name
      t.text :address
      t.string :contact_person
      t.string :contact_number
      t.string :email
      t.string :pan_no
      t.string :gst_reg_no
      t.string :account_holder
      t.string :account_number
      t.string :bank_name
      t.string :baranch_name
      t.string :ifsc_code
      t.attachment :pan_copy
      t.attachment :gst_copy
      t.attachment :cancelled_cheque
      t.string :city
      t.index :pan_no, unique: true

      t.timestamps
    end
  end
end
