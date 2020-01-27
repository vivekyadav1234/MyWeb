class CreateShutterFinishShades < ActiveRecord::Migration[5.0]
  def change
    create_table :shutter_finish_shades do |t|
      t.references :shutter_finish, index: true, foreign_key: true
      t.references :shade, index: true, foreign_key: true

      t.timestamps
    end
  end
end
