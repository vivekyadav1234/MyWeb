class AddStatusUpdatedByToProjectQualityCheck < ActiveRecord::Migration[5.0]
  def change
  	add_reference :project_quality_checks, :status_updated_by, foreign_key: {to_table: :users}
  end
end
