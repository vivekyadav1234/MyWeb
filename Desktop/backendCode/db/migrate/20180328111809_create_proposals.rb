class CreateProposals < ActiveRecord::Migration[5.0]
  def change
    create_table :proposals do |t|
      t.string :proposal_type
      t.string :proposal_name
      t.references :project, foreign_key: true
      t.integer :designer_id
      t.datetime :sent_at

      t.timestamps
    end
  end
end
