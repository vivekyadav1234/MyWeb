class CreateLeadUtmTerms < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_utm_terms do |t|
      t.text :name

      t.timestamps
    end
  end
end
