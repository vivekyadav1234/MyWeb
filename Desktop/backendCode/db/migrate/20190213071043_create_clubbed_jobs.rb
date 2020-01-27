class CreateClubbedJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :clubbed_jobs do |t|
      t.references :quotation, index: true
      t.string :label
      t.timestamps
    end
  end
end
