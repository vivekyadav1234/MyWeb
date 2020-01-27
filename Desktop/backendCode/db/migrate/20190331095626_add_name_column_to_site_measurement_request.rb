class AddNameColumnToSiteMeasurementRequest < ActiveRecord::Migration[5.0]
  def change
   add_column :site_measurement_requests, :name, :string, default: 'site_measurement_output'
  end
end
