class AddBomSliCuttingListDatumToJobElements < ActiveRecord::Migration[5.0]
  def change
  	add_reference :job_elements, :bom_sli_cutting_list_datum, index: true, foreign_key: true
  end
end
