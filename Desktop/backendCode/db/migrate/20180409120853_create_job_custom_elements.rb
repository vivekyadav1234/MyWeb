class CreateJobCustomElements < ActiveRecord::Migration[5.0]
  def change
    create_table :job_custom_elements do |t|
      t.references :modular_job, index: true, foreign_key: true
      t.references :custom_element, index: true, foreign_key: true

      t.integer :quantity

      t.timestamps
    end
  end
end
