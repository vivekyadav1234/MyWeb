class RenameFromMarketingPagesInLeads < ActiveRecord::Migration[5.0]
  def change
    rename_column :leads, :from_marketing_page, :from_fasttrack_page
  end
end
