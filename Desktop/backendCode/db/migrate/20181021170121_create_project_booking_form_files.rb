class CreateProjectBookingFormFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :project_booking_form_files do |t|
    	t.references :project_booking_form, index: true
    	t.attachment :attachment_file
      t.timestamps
    end
  end
end
