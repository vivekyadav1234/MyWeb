class CreateJobAddons < ActiveRecord::Migration[5.0]
  def change
    create_table :job_addons do |t|
      t.references :modular_job, index: true, foreign_key: true
      t.references :addon, index: true, foreign_key: true

      t.integer :quantity

      t.timestamps
    end
  end
end
