class CreateLeadPriorities < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_priorities do |t|
      t.integer :priority_number

      t.references :lead_source, index: true, foreign_key: true
      t.references :lead_type, index: true, foreign_key: true
      t.references :lead_campaign, index: true, foreign_key: true

      t.timestamps
    end
  end
end
