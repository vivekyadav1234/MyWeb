class CreateLeadUtmMedia < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_utm_media do |t|
      t.text :name

      t.timestamps
    end
  end
end
