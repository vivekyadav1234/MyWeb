class AddFromMarketingPageToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :from_marketing_page, :boolean, default: false, null: false
  end
end
