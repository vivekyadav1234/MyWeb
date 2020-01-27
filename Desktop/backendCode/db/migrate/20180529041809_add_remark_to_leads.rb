class AddRemarkToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :remark, :string
  end
end
