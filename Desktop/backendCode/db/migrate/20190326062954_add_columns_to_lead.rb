class AddColumnsToLead < ActiveRecord::Migration[5.0]
  def change
		add_reference :leads, :lead_utm_content, index: true, foreign_key: true
		add_reference :leads, :lead_utm_medium, index: true, foreign_key: true
		add_reference :leads, :lead_utm_term, index: true, foreign_key: true
  end
end
