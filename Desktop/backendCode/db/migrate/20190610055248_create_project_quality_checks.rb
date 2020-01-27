class CreateProjectQualityChecks < ActiveRecord::Migration[5.0]
  def change
    create_table :project_quality_checks do |t|
      t.string :qc_type
      t.references :project
      t.boolean :status
      t.timestamps
    end
  end
end