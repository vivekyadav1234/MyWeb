class ChangeQuantityToFloat < ActiveRecord::Migration[5.0]
  def change
    change_column :job_element_vendors, :quantity, :float
  end
end
