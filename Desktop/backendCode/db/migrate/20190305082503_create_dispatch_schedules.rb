class CreateDispatchSchedules < ActiveRecord::Migration[5.0]
  def change
    create_table :dispatch_schedules do |t|
      t.references :job_element
      t.text :remarks
      t.string :site
      t.string :billing_address
      t.string :shipping_address
      t.integer :created_by, foreign_key: {to_table: :users}
      t.string :status
      t.datetime :schedule_date
      t.timestamps
    end
  end
end
