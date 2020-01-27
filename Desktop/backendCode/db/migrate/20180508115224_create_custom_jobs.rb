class CreateCustomJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :custom_jobs do |t|
      t.references :ownerable, polymorphic: true
      t.string :name
      t.string :space
      t.integer :quantity
      t.float :rate
      t.float :amount
      t.references :custom_element, foreign_key: true

      t.timestamps
    end
  end
end
