class AddRemarkToSiteMeasurementRequests < ActiveRecord::Migration[5.0]
  def change
    add_column :site_measurement_requests, :remark, :text
  end
end
