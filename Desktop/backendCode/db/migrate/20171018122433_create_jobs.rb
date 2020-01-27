class CreateJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :jobs do |t|
      t.string :name
      t.string :description
      t.float :quantity
      t.float :rate
      t.float :amount
      t.references :ownerable, polymorphic: true, index: true
      t.string :tax_name
      t.integer :tax_value
      t.integer :product_id
      t.float :percent_discount
      t.integer :tax_id
      t.string :job_type
      t.string :unit
      t.string :hsn_code
      t.timestamps
    end
  end
end
