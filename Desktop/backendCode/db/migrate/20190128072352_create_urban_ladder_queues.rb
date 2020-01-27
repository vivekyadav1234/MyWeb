class CreateUrbanLadderQueues < ActiveRecord::Migration[5.0]
  def change
    create_table :urban_ladder_queues do |t|
      t.integer :product_id, null: false
      t.integer :job_id
      t.string :status, default: 'pending', null: false
      t.datetime :status_updated_at
      t.string :details

      t.timestamps
    end
  end
end
