class AddAddressToProjectBookingForm < ActiveRecord::Migration[5.0]
  def change
  	add_column :project_booking_forms, :billing_address, :text
  	add_column :project_booking_forms, :gst_number, :integer
  	add_column :project_booking_forms, :billing_name, :string  	
  end
end
