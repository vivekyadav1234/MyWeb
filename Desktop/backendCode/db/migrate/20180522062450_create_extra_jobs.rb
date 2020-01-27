class CreateExtraJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :extra_jobs do |t|
      t.string :name
      t.float :rate
      t.float :quantity
      t.float :amount
      t.string :space
      t.string :vendor_sku
      t.string :specifications

      t.references :ownerable, polymorphic: true, index: true
      t.references :addon, index: true, foreign_key: true

      t.timestamps
    end
  end
end
