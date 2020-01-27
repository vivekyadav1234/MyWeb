class CreateJobElementVendors < ActiveRecord::Migration[5.0]
  def change
    create_table :job_element_vendors do |t|
      t.references :job_element, index: true, foreign_key: true
      t.references :vendor, index: true, foreign_key: true

      t.string :description
      t.float :cost
      t.float :tax_percent
      t.float :final_amount
      # t.string :type_of_vendor
      t.datetime :deliver_by_date
      t.boolean :recommended, default: false

      t.timestamps
    end
  end
end
