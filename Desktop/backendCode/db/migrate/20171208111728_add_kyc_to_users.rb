class AddKycToUsers < ActiveRecord::Migration[5.0]
  def self.up
    change_table :users do |t|
      t.attachment :address_proof
      t.string :gst_number
      t.string :pan
    end
  end

  def self.down
    remove_attachment :users, :address_proof
  end
end
