class CreateShutterFinishes < ActiveRecord::Migration[5.0]
  def change
    create_table :shutter_finishes do |t|
      t.string :name
      t.float :rate

      t.timestamps
    end
  end
end
