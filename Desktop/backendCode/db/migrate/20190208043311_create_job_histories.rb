class CreateJobHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :job_histories do |t|
      t.string :job_type
      t.string :job_name
      t.datetime :run_at
      t.text :info
      t.integer :job_id

      t.timestamps
    end
  end
end
