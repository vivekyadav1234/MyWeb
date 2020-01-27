class AddUserIdToLead < ActiveRecord::Migration[5.0]
  def change
    add_reference :leads, :user, foreign_key: true
  end
end
