class CreateSiteMeasurementRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :site_measurement_requests do |t|
      t.references :project, foreign_key: true
      t.integer :designer_id
      t.integer :sitesupervisor_id
      t.string :request_type
      t.text :address
      t.datetime :scheduled_at

      t.timestamps
    end
  end
end
