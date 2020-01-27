class AddDropReasonToLead < ActiveRecord::Migration[5.0]
  def change
  	add_column :leads, :drop_reason, :string
  end
end
