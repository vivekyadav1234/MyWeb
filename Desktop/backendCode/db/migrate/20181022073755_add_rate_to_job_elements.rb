class AddRateToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :rate, :float, default: 0.0
  end
end
