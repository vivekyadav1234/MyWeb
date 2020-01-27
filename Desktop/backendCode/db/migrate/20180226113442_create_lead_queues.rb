class CreateLeadQueues < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_queues do |t|
      t.integer :priority, default: 1
      t.string :status, default: 'queued'
      t.references :lead, index: true, foreign_key: true

      t.timestamps
    end
  end
end
