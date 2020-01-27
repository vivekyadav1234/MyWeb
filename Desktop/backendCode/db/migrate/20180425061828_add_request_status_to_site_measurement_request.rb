class AddRequestStatusToSiteMeasurementRequest < ActiveRecord::Migration[5.0]
  def change
    add_column :site_measurement_requests, :request_status, :string, :default => "pending"
    add_column :site_measurement_requests, :rescheduled_at, :datetime
  end
end
