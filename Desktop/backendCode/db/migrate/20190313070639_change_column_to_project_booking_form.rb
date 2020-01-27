class ChangeColumnToProjectBookingForm < ActiveRecord::Migration[5.0]
  def change
  	change_column :project_booking_forms, :gst_number, :string
  end
end
