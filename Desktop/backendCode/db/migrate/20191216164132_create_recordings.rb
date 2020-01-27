class CreateRecordings < ActiveRecord::Migration[5.0]
  def change
    create_table :recordings do |t|
      t.attachment :call_recording
      t.belongs_to :event, foreign_key: true

      t.timestamps
    end
  end
end
