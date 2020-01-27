class AddInstaHandleToLead < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :instagram_handle, :string
    add_attachment :leads, :lead_cv
  end
end
