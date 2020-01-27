class AddUserToVendor < ActiveRecord::Migration[5.0]
  def change
    add_reference :vendors, :user, index: true, unique: true, foreign_key: true
  end
end
