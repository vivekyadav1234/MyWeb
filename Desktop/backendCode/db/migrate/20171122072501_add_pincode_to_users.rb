class AddPincodeToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :pincode, :string
  end
end
