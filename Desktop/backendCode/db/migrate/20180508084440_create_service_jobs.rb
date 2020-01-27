class CreateServiceJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :service_jobs do |t|
      t.string :name
      t.string :service_code
      t.string :unit
      t.float :quantity
      t.float :base_rate
      t.float :installation_rate
      t.float :final_rate
      t.float :amount
      t.string :space

      t.references :ownerable, polymorphic: true, index: true
      t.references :service_activity, index: true, foreign_key: true

      t.timestamps
    end
  end
end
