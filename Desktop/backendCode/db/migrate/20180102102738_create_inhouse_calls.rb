class CreateInhouseCalls < ActiveRecord::Migration[5.0]
  def change
    create_table :inhouse_calls do |t|
      t.references :user, index: true, foreign_key: true
      t.string :call_from
      t.integer :call_to_id
      t.string :call_to_type
      t.string :call_to
      t.string :call_for
      t.json :call_response
      t.string :call_type, default: "outgoing"
      t.timestamps
    end
  end
end
