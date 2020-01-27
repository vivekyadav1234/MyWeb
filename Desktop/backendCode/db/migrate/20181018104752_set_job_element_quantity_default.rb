class SetJobElementQuantityDefault < ActiveRecord::Migration[5.0]
  def change
    change_column_default :job_elements, :quantity, 0
  end
end
