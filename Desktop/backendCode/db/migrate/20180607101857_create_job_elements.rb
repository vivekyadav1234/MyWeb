class CreateJobElements < ActiveRecord::Migration[5.0]
  def change
    create_table :job_elements do |t|
      t.string :element_name
      t.references :ownerable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
