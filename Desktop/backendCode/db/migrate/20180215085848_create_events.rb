class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.string :agenda
      t.string :description
      t.datetime :schedule_data_time
      t.string :status
      t.references :ownerable, polymorphic: true
      t.string :location
      t.timestamps
    end
  end
end
