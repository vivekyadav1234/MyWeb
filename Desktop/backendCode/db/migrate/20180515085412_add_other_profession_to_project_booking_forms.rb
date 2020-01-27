class AddOtherProfessionToProjectBookingForms < ActiveRecord::Migration[5.0]
  def change
    add_column :project_booking_forms, :other_professional_details, :string
  end
end
