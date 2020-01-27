class CreateDeliveryStates < ActiveRecord::Migration[5.0]
  def change
    create_table :delivery_states do |t|
      t.references :job_element
      t.text :remarks
      t.integer :created_by, foreign_key: {to_table: :users}
      t.string :status
      t.text :dispached_items
      t.text :pending_items
      t.timestamps
    end
  end
end
