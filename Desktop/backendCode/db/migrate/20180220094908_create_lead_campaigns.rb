class CreateLeadCampaigns < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_campaigns do |t|
      t.string :name
      t.datetime :start_date
      t.datetime :end_date
      t.string :status, null: false, default: 'default'
      t.string :location
      t.boolean :not_removable, null: false, default: false

      t.timestamps
    end
  end
end
