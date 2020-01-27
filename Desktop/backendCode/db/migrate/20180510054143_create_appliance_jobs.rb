class CreateApplianceJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :appliance_jobs do |t|
      t.string :name
      t.string :code
      t.string :make
      t.string :rate
      t.float :quantity
      t.float :amount
      t.string :space
      t.string :subcategory

      t.references :ownerable, polymorphic: true, index: true
      t.references :kitchen_appliance, index: true, foreign_key: true

      t.timestamps
    end
  end
end
