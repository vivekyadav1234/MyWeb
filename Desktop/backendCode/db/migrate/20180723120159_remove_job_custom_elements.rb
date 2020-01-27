class RemoveJobCustomElements < ActiveRecord::Migration[5.0]
  def change
    drop_table :job_custom_elements
  end
end
