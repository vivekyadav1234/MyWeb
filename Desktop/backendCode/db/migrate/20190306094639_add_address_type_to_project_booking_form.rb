class AddAddressTypeToProjectBookingForm < ActiveRecord::Migration[5.0]
  def change
  	 add_column :project_booking_forms, :address_type, :text
  end
end
