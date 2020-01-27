class AddRemarksToQualityPChecks < ActiveRecord::Migration[5.0]
  def change
    add_column :project_quality_checks, :remark, :text
  end
end
