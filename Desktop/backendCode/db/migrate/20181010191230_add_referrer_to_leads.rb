class AddReferrerToLeads < ActiveRecord::Migration[5.0]
  def change
    add_reference :leads, :referrer, index: true, foreign_key: { to_table: :users }
  end
end
