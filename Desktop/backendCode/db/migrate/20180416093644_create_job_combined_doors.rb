class CreateJobCombinedDoors < ActiveRecord::Migration[5.0]
  def change
    create_table :job_combined_doors do |t|
      t.references :modular_job, index: true, foreign_key: true
      t.references :combined_door, index: true, foreign_key: true

      t.integer :quantity, default: 1

      t.timestamps
    end
  end
end
