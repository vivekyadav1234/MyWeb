class CreateLabelJobElements < ActiveRecord::Migration[5.0]
  def change
    create_table :label_job_elements do |t|
      t.references :boq_label, index: true, foreign_key: true
      t.references :job_element, index: true, foreign_key: true

      t.timestamps
    end

    remove_reference :job_elements, :boq_label, index: true, foreign_key: true
  end
end
