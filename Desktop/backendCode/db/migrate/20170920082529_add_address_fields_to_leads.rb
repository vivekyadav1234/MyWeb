class AddAddressFieldsToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :city, :string
    add_column :leads, :pincode, :string
  end
end
