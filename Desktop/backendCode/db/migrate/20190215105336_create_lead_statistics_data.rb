class CreateLeadStatisticsData < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_statistics_data do |t|
      t.datetime :lead_qualification_time
      t.datetime :first_meeting_time
      t.datetime :first_shared_time
      t.datetime :closure_time

      t.references :lead, index: true, foreign_key: true

      t.timestamps
    end
  end
end
