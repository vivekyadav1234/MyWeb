class AddColumnRecordingToEvents < ActiveRecord::Migration[5.0]
  def change
    add_attachment :events, :recording
  end
end
