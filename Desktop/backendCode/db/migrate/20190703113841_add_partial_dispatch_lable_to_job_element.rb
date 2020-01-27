class AddPartialDispatchLableToJobElement < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :added_for_partial_dispatch, :boolean, default: false
    add_column :job_element_vendors, :added_for_partial_dispatch, :boolean, default: false
  end
end
