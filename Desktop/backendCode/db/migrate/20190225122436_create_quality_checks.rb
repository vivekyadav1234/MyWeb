class CreateQualityChecks < ActiveRecord::Migration[5.0]
  def self.up
    create_table :quality_checks do |t|
      t.references :job_element
      t.string :qc_status
      t.datetime :qc_date
      t.integer :created_by
      t.text  :remarks
      t.timestamps
    end
  end

  def self.down
    drop_table :quality_checks
  end
end
