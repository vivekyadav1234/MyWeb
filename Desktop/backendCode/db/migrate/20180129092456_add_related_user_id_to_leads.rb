class AddRelatedUserIdToLeads < ActiveRecord::Migration[5.0]
  def change
    add_reference :leads, :related_user, foreign_key: { to_table: :users }
  end
end
