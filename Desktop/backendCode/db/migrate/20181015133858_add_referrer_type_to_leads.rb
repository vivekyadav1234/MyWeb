class AddReferrerTypeToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :referrer_type, :string
  end
end
