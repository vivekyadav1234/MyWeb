class AddCreatedByToLeads < ActiveRecord::Migration[5.0]
  def change
    add_column :leads, :created_by, :integer
  end
end
