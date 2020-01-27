class CreateProposalDocs < ActiveRecord::Migration[5.0]
  def change
    create_table :proposal_docs do |t|
      t.references :proposal, foreign_key: true
      t.references :ownerable, polymorphic: true
      t.string :is_approved
      t.datetime :approved_at
      t.float :discount_value
      t.integer :disc_status_updated_by
      t.datetime :disc_status_updated_at

      t.timestamps
    end
  end
end
