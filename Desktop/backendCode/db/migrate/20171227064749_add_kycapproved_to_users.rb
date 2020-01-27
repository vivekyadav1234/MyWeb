class AddKycapprovedToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :kyc_approved, :boolean, default: false
  end
end
