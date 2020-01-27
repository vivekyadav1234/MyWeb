class CreateProjectBookingForms < ActiveRecord::Migration[5.0]
  def change
    create_table :project_booking_forms do |t|
      t.datetime :date
      t.references :lead, foreign_key: true
      t.references :project, foreign_key: true
      t.string :flat_no
      t.string :floor_no
      t.text :building_name
      t.text :location
      t.string :city
      t.string :pincode
      t.string :possession_by
      t.string :profession
      t.string :designation
      t.string :company
      t.string :professional_details
      t.string :annual_income
      t.string :landline
      t.string :primary_mobile
      t.string :secondary_mobile
      t.string :primary_email
      t.string :secondary_email
      t.text :current_address
      t.string :order_value
      t.date :order_date

      t.timestamps
    end
  end
end
