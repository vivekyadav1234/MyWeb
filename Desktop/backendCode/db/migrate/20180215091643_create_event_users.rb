class CreateEventUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :event_users do |t|
      t.references :user
      t.references :event
      t.boolean :host
      t.boolean :attendence
      t.string :email
      t.timestamps
    end
  end
end
