class AddDummyemailToTables < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :dummyemail, :boolean, default: false
    add_column :users, :dummyemail, :boolean, default: false
  end
end
