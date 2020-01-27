class CreateDispatchReadinesses < ActiveRecord::Migration[5.0]
  def self.up
    create_table :dispatch_readinesses do |t|
      t.references :job_element
      t.datetime :readiness_date
      t.text :remarks
      t.integer :created_by, foreign_key: {to_table: :users}
      t.timestamps
    end
  end

  def self.down
    drop_table :dispatch_readinesses
  end
end
