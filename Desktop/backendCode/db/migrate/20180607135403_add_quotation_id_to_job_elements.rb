class AddQuotationIdToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_reference :job_elements, :quotation, index: true, foreign_key: true
  end
end
