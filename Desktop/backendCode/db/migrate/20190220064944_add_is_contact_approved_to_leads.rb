class AddIsContactApprovedToLeads < ActiveRecord::Migration[5.0]
  def change
  	add_column :leads, :is_contact_visible, :boolean, default: false
  end
end
