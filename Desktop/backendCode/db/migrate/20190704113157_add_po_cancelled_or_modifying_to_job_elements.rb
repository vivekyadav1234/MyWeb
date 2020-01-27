class AddPoCancelledOrModifyingToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :po_cancelled_or_modifying, :boolean, default: false
    add_column :job_element_vendors, :po_cancelled_or_modifying, :boolean, default: false
  end
end
