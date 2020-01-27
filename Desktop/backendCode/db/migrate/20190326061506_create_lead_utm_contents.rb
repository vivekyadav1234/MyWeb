class CreateLeadUtmContents < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_utm_contents do |t|
      t.text :name

      t.timestamps
    end
  end
end
