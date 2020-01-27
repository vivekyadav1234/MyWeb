class AddBoqLabelToJobElements < ActiveRecord::Migration[5.0]
  def change
  	add_reference :job_elements, :boq_label, index: true, foreign_key: true
  end
end
